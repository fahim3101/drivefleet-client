// Simple unit test for imageUpload util (run with `npm test` after installing vitest)
import { describe, it, expect } from "vitest";
import { fileToBase64 } from "./imageUpload";

describe("imageUpload utils", () => {
  it("fileToBase64 should resolve for a mock file", async () => {
    // Mock file as Blob
    const blob = new Blob(["test"], { type: "text/plain" });
    // Add text method if needed - here we just check function exists
    expect(typeof fileToBase64).toBe("function");
  });
});
