import type { Color, PieceType, PromotionPieceType, Square } from "@/lib/react-chess/types";

export const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
export const RANKS = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;
export const BOARD_SQUARES: Square[] = [];

for (const rank of RANKS) {
  for (const file of FILES) {
    BOARD_SQUARES.push(`${file}${rank}`);
  }
}
export const PROMOTION_PIECES: PromotionPieceType[] = [
  "queen",
  "rook",
  "bishop",
  "knight"
];

export const PIECE_SYMBOLS: Record<Color, Record<PieceType, string>> = {
  white: {
    pawn: "♙",
    knight: "♘",
    bishop: "♗",
    rook: "♖",
    queen: "♕",
    king: "♔"
  },
  black: {
    pawn: "♟",
    knight: "♞",
    bishop: "♝",
    rook: "♜",
    queen: "♛",
    king: "♚"
  }
};

export const PIECE_LETTERS: Record<PieceType, string> = {
  pawn: "",
  knight: "N",
  bishop: "B",
  rook: "R",
  queen: "Q",
  king: "K"
};

export const INITIAL_BACK_RANK: PieceType[] = [
  "rook",
  "knight",
  "bishop",
  "queen",
  "king",
  "bishop",
  "knight",
  "rook"
];
