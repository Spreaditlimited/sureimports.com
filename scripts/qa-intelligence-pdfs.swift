import AppKit
import Foundation
import PDFKit

let source = URL(fileURLWithPath: "/tmp/sureimports-intelligence-batch")
let output = source.appendingPathComponent("qa-renders", isDirectory: true)
try FileManager.default.createDirectory(at: output, withIntermediateDirectories: true)

let banned = [
  "official registry status was not",
  "registry status could not",
  "not accessible during",
  "appears to be a manufacturer",
  "claims to be a manufacturer",
  "confirm if they are factory",
  "confirm whether they are a factory",
  "showroom-only",
  "nigerian importer",
  "nigerian buyer",
]

func render(_ page: PDFPage, to url: URL) throws {
  let bounds = page.bounds(for: .mediaBox)
  let scale: CGFloat = 0.75
  let size = NSSize(width: bounds.width * scale, height: bounds.height * scale)
  let image = page.thumbnail(of: size, for: .mediaBox)
  guard let tiff = image.tiffRepresentation,
        let bitmap = NSBitmapImageRep(data: tiff) else {
    throw NSError(domain: "qa", code: 1)
  }
  guard let data = bitmap.representation(using: .png, properties: [:]) else {
    throw NSError(domain: "qa", code: 2)
  }
  try data.write(to: url)
}

let pdfs = try FileManager.default.contentsOfDirectory(
  at: source,
  includingPropertiesForKeys: nil
).filter { $0.pathExtension.lowercased() == "pdf" }.sorted { $0.lastPathComponent < $1.lastPathComponent }

var failures: [String] = []
var rows: [[String: Any]] = []
for pdf in pdfs {
  guard let document = PDFDocument(url: pdf) else {
    failures.append("\(pdf.lastPathComponent): cannot open")
    continue
  }
  let slug = pdf.deletingPathExtension().lastPathComponent
  let pageCount = document.pageCount
  var blankPages: [Int] = []
  var allText = ""
  var inconsistentSizes: [Int] = []
  var baseline: NSSize?
  for index in 0..<pageCount {
    guard let page = document.page(at: index) else { continue }
    let size = page.bounds(for: .mediaBox).size
    if let baseline, abs(baseline.width - size.width) > 1 || abs(baseline.height - size.height) > 1 {
      inconsistentSizes.append(index + 1)
    } else if baseline == nil {
      baseline = size
    }
    let text = page.string?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
    if text.count < 30 { blankPages.append(index + 1) }
    allText += "\n" + text
  }
  let lower = allText.lowercased()
  let bannedHits = banned.filter { lower.contains($0) }
  if pageCount < 15 { failures.append("\(slug): only \(pageCount) pages") }
  if !blankPages.isEmpty { failures.append("\(slug): blank pages \(blankPages)") }
  if !inconsistentSizes.isEmpty { failures.append("\(slug): inconsistent page sizes \(inconsistentSizes)") }
  if !bannedHits.isEmpty { failures.append("\(slug): banned language \(bannedHits)") }
  if !lower.contains("sure imports assessment") { failures.append("\(slug): assessment section missing") }
  let normalized = lower.replacingOccurrences(of: "\\s+", with: " ", options: .regularExpression)
  if !normalized.contains("your supplier is only half the journey") { failures.append("\(slug): shipping promotion missing") }

  let samplePages = Array(Set([0, min(4, pageCount - 1), min(5, pageCount - 1), min(6, pageCount - 1), min(7, pageCount - 1), max(0, pageCount - 2), pageCount - 1])).sorted()
  for index in samplePages {
    if let page = document.page(at: index) {
      try render(page, to: output.appendingPathComponent("\(slug)-p\(index + 1).png"))
    }
  }
  rows.append([
    "slug": slug,
    "pages": pageCount,
    "characters": allText.count,
    "blankPages": blankPages,
    "bannedHits": bannedHits,
  ])
}

func contactSheet(suffix: String, destination: String) throws {
  let urls = try FileManager.default.contentsOfDirectory(at: output, includingPropertiesForKeys: nil)
    .filter { $0.lastPathComponent.hasSuffix(suffix) }
    .sorted { $0.lastPathComponent < $1.lastPathComponent }
  let columns = 5
  let cell = NSSize(width: 210, height: 300)
  let rows = Int(ceil(Double(urls.count) / Double(columns)))
  let sheet = NSImage(size: NSSize(width: cell.width * CGFloat(columns), height: cell.height * CGFloat(rows)))
  sheet.lockFocus()
  NSColor(calibratedWhite: 0.88, alpha: 1).setFill()
  NSRect(origin: .zero, size: sheet.size).fill()
  for (index, url) in urls.enumerated() {
    guard let image = NSImage(contentsOf: url) else { continue }
    let column = index % columns
    let row = rows - 1 - index / columns
    let inset: CGFloat = 5
    image.draw(in: NSRect(
      x: CGFloat(column) * cell.width + inset,
      y: CGFloat(row) * cell.height + inset,
      width: cell.width - inset * 2,
      height: cell.height - inset * 2
    ))
  }
  sheet.unlockFocus()
  guard let tiff = sheet.tiffRepresentation,
        let bitmap = NSBitmapImageRep(data: tiff),
        let png = bitmap.representation(using: .png, properties: [:]) else {
    throw NSError(domain: "qa", code: 3)
  }
  try png.write(to: output.appendingPathComponent(destination))
}

try contactSheet(suffix: "-p1.png", destination: "contact-sheet-covers.png")
try contactSheet(suffix: "-p8.png", destination: "contact-sheet-suppliers.png")

let result: [String: Any] = [
  "files": pdfs.count,
  "failures": failures,
  "reports": rows,
]
let data = try JSONSerialization.data(withJSONObject: result, options: [.prettyPrinted, .sortedKeys])
try data.write(to: source.appendingPathComponent("qa-report.json"))
print(String(data: data, encoding: .utf8)!)
if !failures.isEmpty { exit(2) }
