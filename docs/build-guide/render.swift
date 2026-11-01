import Foundation
import PDFKit
import AppKit

// Usage: swift render.swift input.pdf outdir
let args = CommandLine.arguments
let doc = PDFDocument(url: URL(fileURLWithPath: args[1]))!
let out = args[2]
try? FileManager.default.createDirectory(atPath: out, withIntermediateDirectories: true)
print("pages:", doc.pageCount)
for i in 0..<doc.pageCount {
    let page = doc.page(at: i)!
    let bounds = page.bounds(for: .mediaBox)
    let scale: CGFloat = 1.1
    let size = NSSize(width: bounds.width * scale, height: bounds.height * scale)
    let img = page.thumbnail(of: size, for: .mediaBox)
    let rep = NSBitmapImageRep(data: img.tiffRepresentation!)!
    let png = rep.representation(using: .png, properties: [:])!
    try! png.write(to: URL(fileURLWithPath: String(format: "%@/p%02d.png", out, i + 1)))
}
