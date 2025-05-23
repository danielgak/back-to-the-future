import { describe, it, expect } from "vitest"
import { Inventory } from "./main.js"

describe("Default test", () => {
  const yesterday = new Date("2024-01-01")
  const today = new Date("2025-01-01")
  const tomorrow = new Date("2026-01-01")
  const future = new Date("2027-01-01")

  it("adds one item to the inventory", () => {
    const inventory = new Inventory()

    inventory.add(today, "🍌")

    const result = inventory.project(today)

    expect(result).toBe("🍌")
  })

  it("adds multiple items to the inventory", () => {
    const inventory = new Inventory()

    inventory.add(today, "🍌")
    inventory.add(today, "🥝")

    const result = inventory.project(today)

    expect(result).toBe("🍌🥝")
  })

  it("does not project items of a future date", () => {
    const inventory = new Inventory()

    inventory.add(today, "🍌")
    inventory.add(tomorrow, "🥝")

    const result = inventory.project(today)

    expect(result).toBe("🍌")
  })

  it("projects items of a past date", () => {
    const inventory = new Inventory()

    inventory.add(yesterday, "🥝")
    inventory.add(today, "🍌")

    const result = inventory.project(today)

    expect(result).toBe("🥝🍌")
  })

  it("handles a general usecase", () => {
    const inventory = new Inventory()

    inventory.add(today, "🍌")
    inventory.add(today, "🥝")
    inventory.add(tomorrow, "🍊")

    expect(inventory.project(yesterday)).toBe("")
    expect(inventory.project(today)).toBe("🍌🥝")
    expect(inventory.project(tomorrow)).toBe("🍌🥝🍊")
  })

  it("removes a previously added item", () => {
    const inventory = new Inventory()

    inventory.add(today, "🍌");
    inventory.remove(today, "🍌");

    expect(inventory.project(today)).toBe("")
  })

  it("does not removes an item if it gets removed in the future", () => {
    const inventory = new Inventory()

    inventory.add(today, "🍌");
    inventory.remove(tomorrow, "🍌");

    expect(inventory.project(today)).toBe("🍌")
  })

  it("does not removes an item if it gets removed in the past", () => {
    const inventory = new Inventory()

    inventory.add(yesterday, "🍌");
    inventory.remove(yesterday, "🍌");
    inventory.add(today, "🍌");

    expect(inventory.project(today)).toBe("🍌")
  })

  it("removes items from the future", () => {
    const inventory = new Inventory()

    inventory.add(today, "🍌");
    inventory.add(today, "🥝");
    inventory.remove(tomorrow, "🍌");

    expect(inventory.project(yesterday)).toBe("")
    expect(inventory.project(today)).toBe("🍌🥝")
    expect(inventory.project(tomorrow)).toBe("🥝")
  })


  it("groups items", () => {
    const inventory = new Inventory()

    inventory.add(today, "🍌");
    inventory.add(today, "🥝");
    inventory.add(today, "🍊");
    inventory.add(today, "🍎");

    expect(inventory.project(future)).toBe("🍌🥝🍊🍎");

    inventory.group(tomorrow, ["🥝", "🍊"]);

    expect(inventory.project(future)).toBe("🍌|🥝🍊|🍎")
  })
})
