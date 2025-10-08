import Foundation

struct summary {
    private static let baseFileName = "summaryData"
    private static var documentsDirectory: URL {
        FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
    }


    private static func fileURL(for walletAddress: String) -> URL {

        let cleaned = walletAddress.lowercased()
        let fileName = "\(baseFileName)_\(cleaned).json"
        return documentsDirectory.appendingPathComponent(fileName)
    }


    static func load(walletAddress: String) -> [Summary] {
        let url = fileURL(for: walletAddress)
        guard let data = try? Data(contentsOf: url) else {
            return []
        }
        return (try? JSONDecoder().decode([Summary].self, from: data)) ?? []
    }


    static func save(_ summaries: [Summary], walletAddress: String) {
        let url = fileURL(for: walletAddress)
        guard let data = try? JSONEncoder().encode(summaries) else { return }
        try? data.write(to: url)
    }

    static func clear(walletAddress: String) {
        let url = fileURL(for: walletAddress)
        try? FileManager.default.removeItem(at: url)
    }
}

