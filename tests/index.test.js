import { describe, it, expect, vi } from 'vitest';
import { createShoppingApplication, runExampleApplication } from '../src/index.js';

describe('src/index.js', () => {
  it('builds the shopping application with service, repository and event bus', () => {
    const { service, unitOfWork, eventBus } = createShoppingApplication();

    expect(service).toBeDefined();
    expect(unitOfWork).toBeDefined();
    expect(eventBus).toBeDefined();

    const list = service.createList({ title: 'Тестовий список', owner: 'tester' });
    expect(list.id).toBeDefined();
    expect(list.title).toBe('Тестовий список');
    expect(unitOfWork.lists.findById(list.id)).not.toBeNull();
  });

  it('runs the example application scenario without errors', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    runExampleApplication();
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });
});
