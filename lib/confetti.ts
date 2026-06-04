import confetti from "canvas-confetti";

export function celebrate() {
  const colors = ["#6366f1", "#58a6ff", "#3fb950", "#d29922"];
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors,
  });
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });
  }, 200);
}
