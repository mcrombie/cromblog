export type Color = "white" | "black";

export type PieceType = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king";

export type PromotionPieceType = "queen" | "rook" | "bishop" | "knight";

export type Square = string;

export interface Piece {
  color: Color;
  type: PieceType;
}

export type BoardState = Record<Square, Piece | null>;

export interface CastlingOptions {
  kingSide: boolean;
  queenSide: boolean;
}

export interface CastlingRights {
  white: CastlingOptions;
  black: CastlingOptions;
}

export type GameStatus =
  | { kind: "active" }
  | { kind: "check" }
  | { kind: "checkmate"; winner: Color }
  | { kind: "stalemate" };

export interface Move {
  from: Square;
  to: Square;
  piece: Piece;
  captured?: Piece;
  promotion?: PromotionPieceType;
  isCastle?: "kingSide" | "queenSide";
  isEnPassant?: boolean;
  notation?: string;
}

export interface MoveInput {
  from: Square;
  to: Square;
  promotion?: PromotionPieceType;
}

export interface GameState {
  board: BoardState;
  turn: Color;
  castlingRights: CastlingRights;
  enPassantTarget: Square | null;
  history: Move[];
  status: GameStatus;
}

export interface CapturedPieces {
  white: Piece[];
  black: Piece[];
}
