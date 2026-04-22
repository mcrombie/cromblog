"use client";

import { Fragment, useMemo, useState } from "react";

import {
  PIECE_SYMBOLS,
  createInitialGameState,
  findKingSquare,
  getBoardRows,
  getCapturedPieces,
  getLegalMovesForSquare,
  getPieceAt,
  getSquareColor,
  isPromotionMove,
  makeMove
} from "@/lib/react-chess";
import type {
  Color,
  GameState,
  Move,
  MoveInput,
  PromotionPieceType,
  Square
} from "@/lib/react-chess";

const STRATEGY_QUOTES = [
  { text: "All warfare is based on deception.", author: "Sun Tzu" },
  { text: "Victory loves prudence.", author: "Latin proverb" },
  { text: "Every advantage is temporary.", author: "Katerina Stoykova Klemer" },
  { text: "Never interrupt your enemy when he is making a mistake.", author: "Napoleon Bonaparte" }
] as const;

function statusCopy(game: GameState) {
  switch (game.status.kind) {
    case "check":
      return {
        title: `${game.turn} to move`,
        detail: "Check is on the board. Every legal move must answer it."
      };
    case "checkmate":
      return {
        title: `${game.status.winner} wins`,
        detail: "Checkmate. The king has no legal escape."
      };
    case "stalemate":
      return {
        title: "Drawn position",
        detail: "Stalemate. No legal moves remain, but the king is not in check."
      };
    default:
      return {
        title: `${game.turn} to move`,
        detail: "Click any piece to see only legal moves from the current position."
      };
  }
}

export default function ReactChessEmbed() {
  const [game, setGame] = useState<GameState>(() => createInitialGameState());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [orientation, setOrientation] = useState<Color>("white");
  const [showHints, setShowHints] = useState(true);
  const [pendingPromotion, setPendingPromotion] = useState<MoveInput | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const legalMoves = selectedSquare ? getLegalMovesForSquare(game, selectedSquare) : [];
  const capturedPieces = getCapturedPieces(game);
  const checkedKingSquare =
    game.status.kind === "check" || game.status.kind === "checkmate"
      ? findKingSquare(game, game.turn)
      : null;
  const lastMove = game.history.length > 0 ? game.history[game.history.length - 1] : null;
  const boardRows = getBoardRows(orientation);
  const currentQuote = STRATEGY_QUOTES[quoteIndex];
  const status = statusCopy(game);

  const moveRows = useMemo(() => {
    const rows: Array<{ turn: number; white?: string; black?: string }> = [];
    for (let index = 0; index < game.history.length; index += 2) {
      rows.push({
        turn: index / 2 + 1,
        white: game.history[index]?.notation,
        black: game.history[index + 1]?.notation
      });
    }
    return rows;
  }, [game.history]);

  const boardSquares = useMemo(() => {
    const squares: Array<{
      square: Square;
      rowIndex: number;
      columnIndex: number;
    }> = [];

    boardRows.forEach((row, rowIndex) => {
      row.forEach((square, columnIndex) => {
        squares.push({ square, rowIndex, columnIndex });
      });
    });

    return squares;
  }, [boardRows]);

  function restart() {
    setGame(createInitialGameState());
    setSelectedSquare(null);
    setPendingPromotion(null);
  }

  function commitMove(input: MoveInput) {
    const nextGame = makeMove(game, input);
    setGame(nextGame);
    setSelectedSquare(null);
    setPendingPromotion(null);
    setQuoteIndex((current) => (current + 1) % STRATEGY_QUOTES.length);
  }

  function handleSquareClick(square: Square) {
    if (pendingPromotion) {
      return;
    }

    const clickedPiece = getPieceAt(game, square);
    const targetMoves = legalMoves.filter((move) => move.to === square);

    if (selectedSquare && targetMoves.length > 0) {
      if (isPromotionMove(game, { from: selectedSquare, to: square })) {
        setPendingPromotion({ from: selectedSquare, to: square });
      } else {
        commitMove({ from: selectedSquare, to: square });
      }
      return;
    }

    if (clickedPiece && clickedPiece.color === game.turn) {
      setSelectedSquare(square);
      return;
    }

    setSelectedSquare(null);
  }

  function handlePromotionChoice(piece: PromotionPieceType) {
    if (!pendingPromotion) {
      return;
    }

    commitMove({ ...pendingPromotion, promotion: piece });
  }

  return (
    <div className="content-flow">
      <section className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--panel-strong)] p-6 shadow-card sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(300px,0.92fr)]">
          <div className="content-flow">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-pine-700">
                Play the rebuild
              </p>
              <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
                The game is part of the article.
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-pine-700">
                This embedded board is the modern TypeScript rebuild itself, not
                a screenshot or a separate demo link. The point of the post is
                to let the architecture claims face immediate use.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-white/70 p-4 sm:p-5">
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-pine-700">
                    Status
                  </p>
                  <h3 className="mt-2 font-serif text-2xl text-ink">{status.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-pine-700">{status.detail}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-pine-700/70">
                    Click a white piece, then click a highlighted square.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={restart}
                    className="rounded-full border border-pine-700 px-4 py-2 text-sm text-pine-800 transition hover:bg-pine-800 hover:text-pine-50"
                  >
                    New game
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setOrientation((current) => (current === "white" ? "black" : "white"))
                    }
                    className="rounded-full border border-[color:var(--border)] px-4 py-2 text-sm text-pine-800 transition hover:bg-white"
                  >
                    Flip board
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowHints((current) => !current)}
                    className="rounded-full border border-[color:var(--border)] px-4 py-2 text-sm text-pine-800 transition hover:bg-white"
                  >
                    {showHints ? "Hide hints" : "Show hints"}
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-[color:var(--border)] bg-stone-950/95 p-3 shadow-card sm:p-4">
              <div className="mx-auto grid aspect-square w-full max-w-[760px] grid-cols-8 overflow-hidden rounded-[1.25rem] border border-white/10">
                {boardSquares.map(({ square, rowIndex, columnIndex }) => {
                  const piece = getPieceAt(game, square);
                  const isSelected = selectedSquare === square;
                  const isTarget = showHints && legalMoves.some((move) => move.to === square);
                  const isCheckedKing = checkedKingSquare === square;
                  const isLastMove =
                    lastMove != null &&
                    (lastMove.from === square || lastMove.to === square);
                  const squareTone = getSquareColor(square) === "dark"
                    ? "bg-[#6f7e58]"
                    : "bg-[#f2e4cf]";
                  const labelTone = getSquareColor(square) === "dark"
                    ? "text-white/55"
                    : "text-stone-900/45";

                  return (
                    <button
                      key={square}
                      type="button"
                      onClick={() => handleSquareClick(square)}
                      className={[
                        "relative flex items-center justify-center transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-pine-600 focus:ring-inset",
                        squareTone,
                        isSelected ? "ring-4 ring-white/40 ring-inset" : "",
                        isLastMove ? "shadow-[inset_0_0_0_999px_rgba(217,170,86,0.18)]" : "",
                        isCheckedKing ? "shadow-[inset_0_0_0_999px_rgba(170,47,47,0.35)]" : ""
                      ].join(" ")}
                      aria-label={`${square} ${piece ? `${piece.color} ${piece.type}` : "empty"}`}
                    >
                      {columnIndex === 0 ? (
                        <span className={`absolute left-1.5 top-1 text-[10px] font-semibold uppercase ${labelTone}`}>
                          {square[1]}
                        </span>
                      ) : null}
                      {rowIndex === boardRows.length - 1 ? (
                        <span className={`absolute bottom-1 right-1.5 text-[10px] font-semibold uppercase ${labelTone}`}>
                          {square[0]}
                        </span>
                      ) : null}
                      {piece ? (
                        <span
                          className={[
                            "select-none text-[clamp(1.9rem,4vw,3.2rem)] leading-none drop-shadow-sm",
                            piece.color === "white"
                              ? "text-stone-50 [text-shadow:0_1px_0_rgba(0,0,0,0.45),0_0_10px_rgba(255,255,255,0.18)]"
                              : "text-stone-900"
                          ].join(" ")}
                        >
                          {PIECE_SYMBOLS[piece.color][piece.type]}
                        </span>
                      ) : null}
                      {isTarget && !piece ? (
                        <span className="h-3 w-3 rounded-full bg-pine-800/55" />
                      ) : null}
                      {isTarget && piece ? (
                        <span className="pointer-events-none absolute inset-2 rounded-full border-2 border-pine-900/75" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <section className="rounded-[1.75rem] border border-[color:var(--border)] bg-white/70 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-pine-700">
                Field note
              </p>
              <blockquote className="mt-3 font-serif text-3xl leading-tight text-ink">
                “{currentQuote.text}”
              </blockquote>
              <p className="mt-4 text-sm leading-7 text-pine-700">{currentQuote.author}</p>
            </section>

            <section className="rounded-[1.75rem] border border-[color:var(--border)] bg-white/70 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-pine-700">
                Captured pieces
              </p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm text-pine-700">White lost</p>
                  <div className="mt-2 flex min-h-[2.5rem] flex-wrap gap-2">
                    {capturedPieces.white.length > 0 ? (
                      capturedPieces.white.map((piece, index) => (
                        <span
                          key={`white-${piece.type}-${index}`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-stone-100 text-2xl"
                        >
                          {PIECE_SYMBOLS.white[piece.type]}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-pine-700/70">None yet.</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-pine-700">Black lost</p>
                  <div className="mt-2 flex min-h-[2.5rem] flex-wrap gap-2">
                    {capturedPieces.black.length > 0 ? (
                      capturedPieces.black.map((piece, index) => (
                        <span
                          key={`black-${piece.type}-${index}`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-stone-100 text-2xl"
                        >
                          {PIECE_SYMBOLS.black[piece.type]}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-pine-700/70">None yet.</span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-[color:var(--border)] bg-[color:var(--panel)] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-pine-700">
                Move log
              </p>
              <div className="mt-4 max-h-[20rem] overflow-auto">
                <div className="grid grid-cols-[3rem_1fr_1fr] gap-2 text-sm">
                  <div className="font-medium uppercase tracking-[0.14em] text-pine-700/70">
                    Turn
                  </div>
                  <div className="font-medium uppercase tracking-[0.14em] text-pine-700/70">
                    White
                  </div>
                  <div className="font-medium uppercase tracking-[0.14em] text-pine-700/70">
                    Black
                  </div>
                  {moveRows.map((entry) => (
                    <Fragment key={entry.turn}>
                      <div className="rounded-2xl bg-white/60 px-3 py-2 text-pine-700">
                        {entry.turn}.
                      </div>
                      <div className="rounded-2xl bg-white/60 px-3 py-2 text-pine-800">
                        {entry.white ?? "..."}
                      </div>
                      <div className="rounded-2xl bg-white/60 px-3 py-2 text-pine-800">
                        {entry.black ?? "..."}
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      {pendingPromotion ? (
        <section className="rounded-3xl border border-[color:var(--border)] bg-pine-50 p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.22em] text-pine-700">
            Promotion
          </p>
          <h3 className="mt-2 font-serif text-2xl text-ink">Choose the new piece</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            {(["queen", "rook", "bishop", "knight"] as PromotionPieceType[]).map(
              (piece) => (
                <button
                  key={piece}
                  type="button"
                  onClick={() => handlePromotionChoice(piece)}
                  className="rounded-3xl border border-[color:var(--border)] bg-white px-4 py-5 text-center transition hover:-translate-y-0.5 hover:shadow-card"
                >
                  <span className="block text-4xl">
                    {PIECE_SYMBOLS[getPieceAt(game, pendingPromotion.from)?.color ?? "white"][piece]}
                  </span>
                  <span className="mt-2 block text-sm capitalize text-pine-800">{piece}</span>
                </button>
              )
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
