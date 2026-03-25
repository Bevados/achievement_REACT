import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// После каждого теста очищаем виртуальный DOM.
// Зачем это нужно:
// 1) следующий тест стартует в "чистой" среде;
// 2) элементы из предыдущего render() не протекают в новый тест;
// 3) снижается риск нестабильных (flaky) падений, когда тесты влияют друг на друга.
afterEach(() => {
  cleanup();
});
