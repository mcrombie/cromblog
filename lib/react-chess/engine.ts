import {
  BOARD_SQUARES,
  FILES,
  INITIAL_BACK_RANK,
  PIECE_LETTERS,
  PROMOTION_PIECES,
  RANKS
} from "@/lib/react-chess/constants";
import type {
  BoardState,
  CapturedPieces,
  CastlingRights,
  Color,
  GameState,
  GameStatus,
  Move,
  MoveInput,
  Piece,
  Square
} from "@/lib/react-chess/types";

const SLIDING_DIRECTIONS = {
  bishop: [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1]
  ],
  rook: [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ],
  queen: [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ]
} as const;

const KNIGHT_OFFSETS = [
  [1, 2],
  [2, 1],
  [2, -1],
  [1, -2],
  [-1, -2],
  [-2, -1],
  [-2, 1],
  [-1, 2]
] as const;

const KING_OFFSETS = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, 1],
  [0, -1],
  [-1, 1],
  [-1, 0],
  [-1, -1]
] as const;

export function oppositeColor(color: Color): Color {
  return color === "white" ? "black" : "white";
}

export function createEmptyBoard(): BoardState {
  return BOARD_SQUARES.reduce<BoardState>((board, square) => {
    board[square] = null;
    return board;
  }, {});
}

function cloneBoard(board: BoardState): BoardState {
  return BOARD_SQUARES.reduce<BoardState>((nextBoard, square) => {
    const piece = board[square];
    nextBoard[square] = piece ? { ...piece } : null;
    return nextBoard;
  }, {});
}

function createInitialBoard(): BoardState {
  const board = createEmptyBoard();

  FILES.forEach((file, index) => {
    board[`${file}2`] = { color: "white", type: "pawn" };
    board[`${file}7`] = { color: "black", type: "pawn" };
    board[`${file}1`] = { color: "white", type: INITIAL_BACK_RANK[index] };
    board[`${file}8`] = { color: "black", type: INITIAL_BACK_RANK[index] };
  });

  return board;
}

function createCastlingRights(): CastlingRights {
  return {
    white: { kingSide: true, queenSide: true },
    black: { kingSide: true, queenSide: true }
  };
}

export function createGameState(overrides: Partial<Omit<GameState, "status">> = {}): GameState {
  const baseState: Omit<GameState, "status"> = {
    board: createInitialBoard(),
    turn: "white",
    castlingRights: createCastlingRights(),
    enPassantTarget: null,
    history: []
  };

  const state: GameState = {
    ...baseState,
    ...overrides,
    board: cloneBoard(overrides.board ?? baseState.board),
    castlingRights: overrides.castlingRights
      ? {
          white: { ...overrides.castlingRights.white },
          black: { ...overrides.castlingRights.black }
        }
      : createCastlingRights(),
    history: overrides.history ? overrides.history.map((move) => ({ ...move })) : [],
    status: { kind: "active" }
  };

  state.status = evaluateGameStatus(state);
  return state;
}

export function createInitialGameState(): GameState {
  return createGameState();
}

function getCoords(square: Square): [number, number] {
  return [
    FILES.indexOf(square[0] as (typeof FILES)[number]),
    RANKS.indexOf(square[1] as (typeof RANKS)[number])
  ];
}

function isOnBoard(file: number, rank: number): boolean {
  return file >= 0 && file < 8 && rank >= 0 && rank < 8;
}

function toSquare(file: number, rank: number): Square {
  return `${FILES[file]}${RANKS[rank]}`;
}

function getPiece(board: BoardState, square: Square): Piece | null {
  return board[square] ?? null;
}

export function findKingSquare(state: GameState, color: Color): Square | null {
  for (const square of BOARD_SQUARES) {
    const piece = getPiece(state.board, square);
    if (piece?.type === "king" && piece.color === color) {
      return square;
    }
  }

  return null;
}

export function isSquareAttacked(state: GameState, square: Square, byColor: Color): boolean {
  const [file, rank] = getCoords(square);
  const pawnRankOffset = byColor === "white" ? -1 : 1;
  const pawnAttackSquares = [
    [file - 1, rank + pawnRankOffset],
    [file + 1, rank + pawnRankOffset]
  ];

  for (const [targetFile, targetRank] of pawnAttackSquares) {
    if (!isOnBoard(targetFile, targetRank)) {
      continue;
    }

    const piece = getPiece(state.board, toSquare(targetFile, targetRank));
    if (piece?.color === byColor && piece.type === "pawn") {
      return true;
    }
  }

  for (const [fileOffset, rankOffset] of KNIGHT_OFFSETS) {
    const targetFile = file + fileOffset;
    const targetRank = rank + rankOffset;
    if (!isOnBoard(targetFile, targetRank)) {
      continue;
    }

    const piece = getPiece(state.board, toSquare(targetFile, targetRank));
    if (piece?.color === byColor && piece.type === "knight") {
      return true;
    }
  }

  for (const [fileOffset, rankOffset] of KING_OFFSETS) {
    const targetFile = file + fileOffset;
    const targetRank = rank + rankOffset;
    if (!isOnBoard(targetFile, targetRank)) {
      continue;
    }

    const piece = getPiece(state.board, toSquare(targetFile, targetRank));
    if (piece?.color === byColor && piece.type === "king") {
      return true;
    }
  }

  for (const [fileOffset, rankOffset] of SLIDING_DIRECTIONS.bishop) {
    let targetFile = file + fileOffset;
    let targetRank = rank + rankOffset;
    while (isOnBoard(targetFile, targetRank)) {
      const piece = getPiece(state.board, toSquare(targetFile, targetRank));
      if (piece) {
        if (
          piece.color === byColor &&
          (piece.type === "bishop" || piece.type === "queen")
        ) {
          return true;
        }
        break;
      }
      targetFile += fileOffset;
      targetRank += rankOffset;
    }
  }

  for (const [fileOffset, rankOffset] of SLIDING_DIRECTIONS.rook) {
    let targetFile = file + fileOffset;
    let targetRank = rank + rankOffset;
    while (isOnBoard(targetFile, targetRank)) {
      const piece = getPiece(state.board, toSquare(targetFile, targetRank));
      if (piece) {
        if (
          piece.color === byColor &&
          (piece.type === "rook" || piece.type === "queen")
        ) {
          return true;
        }
        break;
      }
      targetFile += fileOffset;
      targetRank += rankOffset;
    }
  }

  return false;
}

export function isInCheck(state: GameState, color: Color): boolean {
  const kingSquare = findKingSquare(state, color);
  if (!kingSquare) {
    return false;
  }

  return isSquareAttacked(state, kingSquare, oppositeColor(color));
}

function createPromotionMoves(
  from: Square,
  to: Square,
  piece: Piece,
  captured?: Piece,
  extra: Partial<Move> = {}
): Move[] {
  if (piece.type !== "pawn") {
    return [{ from, to, piece, captured, ...extra }];
  }

  const promotionRank = piece.color === "white" ? "8" : "1";
  if (to[1] !== promotionRank) {
    return [{ from, to, piece, captured, ...extra }];
  }

  return PROMOTION_PIECES.map((promotion) => ({
    from,
    to,
    piece,
    captured,
    promotion,
    ...extra
  }));
}

function getSlidingMoves(state: GameState, from: Square, piece: Piece): Move[] {
  const [file, rank] = getCoords(from);
  const directions =
    SLIDING_DIRECTIONS[piece.type as keyof typeof SLIDING_DIRECTIONS] ?? [];
  const moves: Move[] = [];

  for (const [fileOffset, rankOffset] of directions) {
    let targetFile = file + fileOffset;
    let targetRank = rank + rankOffset;

    while (isOnBoard(targetFile, targetRank)) {
      const to = toSquare(targetFile, targetRank);
      const targetPiece = getPiece(state.board, to);

      if (!targetPiece) {
        moves.push({ from, to, piece });
      } else {
        if (targetPiece.color !== piece.color) {
          moves.push({ from, to, piece, captured: targetPiece });
        }
        break;
      }

      targetFile += fileOffset;
      targetRank += rankOffset;
    }
  }

  return moves;
}

function getPawnMoves(state: GameState, from: Square, piece: Piece): Move[] {
  const [file, rank] = getCoords(from);
  const direction = piece.color === "white" ? 1 : -1;
  const startRank = piece.color === "white" ? 1 : 6;
  const moves: Move[] = [];
  const oneStepRank = rank + direction;

  if (isOnBoard(file, oneStepRank)) {
    const oneStep = toSquare(file, oneStepRank);
    if (!getPiece(state.board, oneStep)) {
      moves.push(...createPromotionMoves(from, oneStep, piece));

      const twoStepRank = rank + direction * 2;
      const twoStep = toSquare(file, twoStepRank);
      if (rank === startRank && !getPiece(state.board, twoStep)) {
        moves.push({ from, to: twoStep, piece });
      }
    }
  }

  for (const fileOffset of [-1, 1]) {
    const targetFile = file + fileOffset;
    const targetRank = rank + direction;
    if (!isOnBoard(targetFile, targetRank)) {
      continue;
    }

    const to = toSquare(targetFile, targetRank);
    const targetPiece = getPiece(state.board, to);
    if (targetPiece && targetPiece.color !== piece.color) {
      moves.push(...createPromotionMoves(from, to, piece, targetPiece));
    } else if (state.enPassantTarget === to) {
      const capturedSquare = toSquare(targetFile, rank);
      const captured = getPiece(state.board, capturedSquare);
      if (captured?.type === "pawn" && captured.color !== piece.color) {
        moves.push(
          ...createPromotionMoves(from, to, piece, captured, {
            isEnPassant: true
          })
        );
      }
    }
  }

  return moves;
}

function getKnightMoves(state: GameState, from: Square, piece: Piece): Move[] {
  const [file, rank] = getCoords(from);
  const moves: Move[] = [];

  for (const [fileOffset, rankOffset] of KNIGHT_OFFSETS) {
    const targetFile = file + fileOffset;
    const targetRank = rank + rankOffset;
    if (!isOnBoard(targetFile, targetRank)) {
      continue;
    }

    const to = toSquare(targetFile, targetRank);
    const targetPiece = getPiece(state.board, to);
    if (!targetPiece || targetPiece.color !== piece.color) {
      moves.push({
        from,
        to,
        piece,
        captured: targetPiece ?? undefined
      });
    }
  }

  return moves;
}

function getKingMoves(state: GameState, from: Square, piece: Piece): Move[] {
  const [file, rank] = getCoords(from);
  const moves: Move[] = [];

  for (const [fileOffset, rankOffset] of KING_OFFSETS) {
    const targetFile = file + fileOffset;
    const targetRank = rank + rankOffset;
    if (!isOnBoard(targetFile, targetRank)) {
      continue;
    }

    const to = toSquare(targetFile, targetRank);
    const targetPiece = getPiece(state.board, to);
    if (!targetPiece || targetPiece.color !== piece.color) {
      moves.push({
        from,
        to,
        piece,
        captured: targetPiece ?? undefined
      });
    }
  }

  const rights = state.castlingRights[piece.color];
  const rankChar = piece.color === "white" ? "1" : "8";

  if (rights.kingSide) {
    const pathSquares = [`f${rankChar}`, `g${rankChar}`];
    const rookSquare = `h${rankChar}`;
    const rook = getPiece(state.board, rookSquare);
    const pathClear = pathSquares.every((square) => !getPiece(state.board, square));
    if (pathClear && rook?.type === "rook" && rook.color === piece.color) {
      moves.push({
        from,
        to: `g${rankChar}`,
        piece,
        isCastle: "kingSide"
      });
    }
  }

  if (rights.queenSide) {
    const pathSquares = [`d${rankChar}`, `c${rankChar}`, `b${rankChar}`];
    const rookSquare = `a${rankChar}`;
    const rook = getPiece(state.board, rookSquare);
    const pathClear = pathSquares.every((square) => !getPiece(state.board, square));
    if (pathClear && rook?.type === "rook" && rook.color === piece.color) {
      moves.push({
        from,
        to: `c${rankChar}`,
        piece,
        isCastle: "queenSide"
      });
    }
  }

  return moves;
}

function getPseudoLegalMovesForSquare(state: GameState, square: Square): Move[] {
  const piece = getPiece(state.board, square);
  if (!piece) {
    return [];
  }

  switch (piece.type) {
    case "pawn":
      return getPawnMoves(state, square, piece);
    case "knight":
      return getKnightMoves(state, square, piece);
    case "bishop":
    case "rook":
    case "queen":
      return getSlidingMoves(state, square, piece);
    case "king":
      return getKingMoves(state, square, piece);
    default:
      return [];
  }
}

function updateCastlingRights(state: GameState, move: Move): CastlingRights {
  const nextRights: CastlingRights = {
    white: { ...state.castlingRights.white },
    black: { ...state.castlingRights.black }
  };

  if (move.piece.type === "king") {
    nextRights[move.piece.color] = { kingSide: false, queenSide: false };
  }

  if (move.piece.type === "rook") {
    if (move.from === "a1") {
      nextRights.white.queenSide = false;
    }
    if (move.from === "h1") {
      nextRights.white.kingSide = false;
    }
    if (move.from === "a8") {
      nextRights.black.queenSide = false;
    }
    if (move.from === "h8") {
      nextRights.black.kingSide = false;
    }
  }

  if (move.captured?.type === "rook") {
    if (move.to === "a1") {
      nextRights.white.queenSide = false;
    }
    if (move.to === "h1") {
      nextRights.white.kingSide = false;
    }
    if (move.to === "a8") {
      nextRights.black.queenSide = false;
    }
    if (move.to === "h8") {
      nextRights.black.kingSide = false;
    }
  }

  return nextRights;
}

function getCastleTransitSquares(move: Move): Square[] {
  if (move.isCastle === "kingSide") {
    return [move.from, `${String.fromCharCode(move.from.charCodeAt(0) + 1)}${move.from[1]}`, move.to];
  }

  if (move.isCastle === "queenSide") {
    return [move.from, `${String.fromCharCode(move.from.charCodeAt(0) - 1)}${move.from[1]}`, move.to];
  }

  return [];
}

function applyMoveWithoutStatus(state: GameState, move: Move, recordHistory: boolean): GameState {
  const board = cloneBoard(state.board);
  const movingPiece = board[move.from];

  if (!movingPiece) {
    throw new Error(`No piece found on ${move.from}`);
  }

  board[move.from] = null;

  if (move.isEnPassant) {
    const [targetFile, targetRank] = getCoords(move.to);
    const captureRank = movingPiece.color === "white" ? targetRank - 1 : targetRank + 1;
    board[toSquare(targetFile, captureRank)] = null;
  }

  if (move.isCastle) {
    const rankChar = movingPiece.color === "white" ? "1" : "8";
    if (move.isCastle === "kingSide") {
      board[`f${rankChar}`] = board[`h${rankChar}`];
      board[`h${rankChar}`] = null;
    } else {
      board[`d${rankChar}`] = board[`a${rankChar}`];
      board[`a${rankChar}`] = null;
    }
  }

  board[move.to] = {
    color: movingPiece.color,
    type: move.promotion ?? movingPiece.type
  };

  let enPassantTarget: Square | null = null;
  if (movingPiece.type === "pawn") {
    const [, fromRank] = getCoords(move.from);
    const [toFile, toRank] = getCoords(move.to);
    if (Math.abs(toRank - fromRank) === 2) {
      enPassantTarget = toSquare(toFile, (toRank + fromRank) / 2);
    }
  }

  return {
    board,
    turn: oppositeColor(state.turn),
    castlingRights: updateCastlingRights(state, move),
    enPassantTarget,
    history: recordHistory ? [...state.history, move] : state.history,
    status: { kind: "active" }
  };
}

function buildMoveNotation(_previousState: GameState, move: Move, nextState: GameState): string {
  if (move.isCastle === "kingSide") {
    return nextState.status.kind === "checkmate"
      ? "O-O#"
      : nextState.status.kind === "check"
        ? "O-O+"
        : "O-O";
  }

  if (move.isCastle === "queenSide") {
    return nextState.status.kind === "checkmate"
      ? "O-O-O#"
      : nextState.status.kind === "check"
        ? "O-O-O+"
        : "O-O-O";
  }

  const pieceLetter = PIECE_LETTERS[move.piece.type];
  const isCapture = Boolean(move.captured) || move.isEnPassant;
  const captureMarker = isCapture ? "x" : "";
  const pawnFilePrefix = move.piece.type === "pawn" && isCapture ? move.from[0] : "";
  const promotionSuffix = move.promotion ? `=${PIECE_LETTERS[move.promotion]}` : "";
  const checkSuffix =
    nextState.status.kind === "checkmate"
      ? "#"
      : nextState.status.kind === "check"
        ? "+"
        : "";

  return `${pieceLetter || pawnFilePrefix}${captureMarker}${move.to}${promotionSuffix}${checkSuffix}`;
}

function isCastleMoveSafe(state: GameState, move: Move): boolean {
  const enemyColor = oppositeColor(move.piece.color);
  return getCastleTransitSquares(move).every(
    (square) => !isSquareAttacked(state, square, enemyColor)
  );
}

export function getLegalMovesForSquare(state: GameState, square: Square): Move[] {
  const piece = getPiece(state.board, square);
  if (!piece || piece.color !== state.turn) {
    return [];
  }

  const pseudoMoves = getPseudoLegalMovesForSquare(state, square);

  return pseudoMoves.filter((move) => {
    if (move.isCastle && !isCastleMoveSafe(state, move)) {
      return false;
    }

    const simulatedState = applyMoveWithoutStatus(state, move, false);
    return !isInCheck(simulatedState, piece.color);
  });
}

export function getAllLegalMoves(state: GameState, color: Color = state.turn): Move[] {
  const moves: Move[] = [];

  for (const square of BOARD_SQUARES) {
    const piece = getPiece(state.board, square);
    if (!piece || piece.color !== color) {
      continue;
    }

    const stateForColor = color === state.turn ? state : { ...state, turn: color };
    moves.push(...getLegalMovesForSquare(stateForColor, square));
  }

  return moves;
}

export function evaluateGameStatus(state: GameState): GameStatus {
  const playerInCheck = isInCheck(state, state.turn);
  const legalMoves = getAllLegalMoves({ ...state, status: { kind: "active" } }, state.turn);

  if (legalMoves.length === 0) {
    if (playerInCheck) {
      return { kind: "checkmate", winner: oppositeColor(state.turn) };
    }

    return { kind: "stalemate" };
  }

  if (playerInCheck) {
    return { kind: "check" };
  }

  return { kind: "active" };
}

export function makeMove(state: GameState, input: MoveInput): GameState {
  const legalMoves = getLegalMovesForSquare(state, input.from);
  const move = legalMoves.find(
    (candidate) =>
      candidate.to === input.to &&
      (candidate.promotion ?? undefined) === (input.promotion ?? undefined)
  );

  if (!move) {
    throw new Error(`Illegal move: ${input.from} -> ${input.to}`);
  }

  const nextState = applyMoveWithoutStatus(state, move, true);
  nextState.status = evaluateGameStatus(nextState);
  const notation = buildMoveNotation(state, move, nextState);
  nextState.history[nextState.history.length - 1] = {
    ...move,
    notation
  };

  return nextState;
}

export function getCapturedPieces(state: GameState): CapturedPieces {
  return state.history.reduce<CapturedPieces>(
    (captured, move) => {
      if (move.captured) {
        captured[move.captured.color].push(move.captured);
      }
      return captured;
    },
    { white: [], black: [] }
  );
}

export function getBoardRows(orientation: Color): Square[][] {
  const fileOrder = orientation === "white" ? [...FILES] : [...FILES].reverse();
  const rankOrder = orientation === "white" ? [...RANKS].reverse() : [...RANKS];

  return rankOrder.map((rank) => fileOrder.map((file) => `${file}${rank}`));
}

export function getSquareColor(square: Square): "light" | "dark" {
  const [file, rank] = getCoords(square);
  return (file + rank) % 2 === 0 ? "dark" : "light";
}

export function isPromotionMove(state: GameState, input: MoveInput): boolean {
  return getLegalMovesForSquare(state, input.from).some(
    (move) => move.to === input.to && Boolean(move.promotion)
  );
}

export function getPieceAt(state: GameState, square: Square): Piece | null {
  return getPiece(state.board, square);
}
