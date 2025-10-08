import UIKit
import Web3
import WebKit

class showNFTVC: UIViewController, UICollectionViewDelegate, UICollectionViewDataSource, NFT.NFTDelegate {
    
    func didUpdateData() {
        NFTs.removeAll()
        loadNFTs()
        nftCollection.reloadData()
    }
    
    
    
    var NFTs: [Metadata] = []
    
    var refresh = UIRefreshControl()
    
    var cameFromScanningVC: Bool?
    
    private var nftCollection: UICollectionView = {
        let layout = UICollectionViewFlowLayout()
        layout.scrollDirection = .vertical
        layout.minimumInteritemSpacing = 5
        layout.minimumLineSpacing = 10
        
        layout.itemSize = CGSize(width: 175, height: 175)
        layout.sectionInset = UIEdgeInsets(top: 10, left: 15, bottom: 10, right: 15)

        
        let collectionView = UICollectionView(frame: .zero, collectionViewLayout: layout)
        return collectionView
    }()
    
    let backButton = UIButton()
    
    var id: BigUInt?
    var tokens: [BigUInt]?
    var location: String?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        view.backgroundColor = .white
        resetBackButton()
        
        nftCollection.delegate = self
        nftCollection.dataSource = self
        nftCollection.register(Cell.self, forCellWithReuseIdentifier: "Cell")
        nftCollection.backgroundColor = .white
        
        refresh.addTarget(self, action: #selector(ref), for: .valueChanged)
        refresh.tintColor = .black
        nftCollection.refreshControl = refresh

        
        
        view.addSubview(nftCollection)
        nftCollection.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            nftCollection.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            nftCollection.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            nftCollection.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            nftCollection.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
        
        loadNFTs()
    }
    
    private func resetBackButton() {
        backButton.setTitle(" Back", for: .normal)
        backButton.setTitleColor(.black, for: .normal)
        backButton.setImage(UIImage(systemName: "chevron.backward"), for: .normal)
        backButton.addTarget(self, action: #selector(goBackToRoot), for: .touchUpInside)
        
        let backBarButton = UIBarButtonItem(customView: backButton)
        self.navigationItem.leftBarButtonItem = backBarButton
    }
    
    @objc func goBackToRoot() {
        navigationController?.popToRootViewController(animated: true)
    }
    
    @objc func ref(send: UIRefreshControl){
        DispatchQueue.main.asyncAfter(deadline: .now() + 25) {
            self.nftCollection.reloadData()
            self.refresh.endRefreshing()
        }
    }
    
    
    
    func loadNFTs() {

        let addr = Connect.connection.metamaskSDK.account
        
        if !addr.isEmpty {
            if tokens != nil {
                for x in tokens! {
                    if let metadata = Connect.connection.returnURI(id!, try! EthereumAddress(hex: addr, eip55: true), BigUInt(tokens!.firstIndex(of: x)!), tokens: tokens!) {
                            NFTs.append(metadata)
                    }
                }
            }
            else{
                let alertController = UIAlertController(title: "No NFTs", message: "You don't have any NFTs", preferredStyle: .alert)
                let defaultAction = UIAlertAction(title: "OK", style: .default, handler: nil)
                alertController.addAction(defaultAction)
                self.present(alertController, animated: true, completion: nil)
                self.navigationController?.popViewController(animated: true)
            }
        }

        NFTs.sort { $0.status < $1.status }
        
        nftCollection.reloadData()
        handleAfterScan()
    }
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return NFTs.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "Cell", for: indexPath) as! Cell
        let nft = NFTs[indexPath.row]
        cell.image.loadHTMLString(changeSVG(nft.image, width: 700, height: 700, viewBox: "0 0 200 200", fontSize: 16), baseURL: nil)
        return cell
    }
    
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath){
        
        guard let cell = collectionView.cellForItem(at: indexPath) else { return }
        
        
        UIView.animate(withDuration: 0.1, animations: {
                cell.transform = CGAffineTransform(scaleX: 0.9, y: 0.9)
            }) { _ in
                UIView.animate(withDuration: 0.1) {
                    cell.transform = CGAffineTransform.identity
                    let nftVC = NFT()
                    nftVC.tariff = self.NFTs[indexPath.row].tariff
                    nftVC.date = BigUInt(self.NFTs[indexPath.row].date)
                    nftVC.visits = BigUInt(self.NFTs[indexPath.row].visits)
                    nftVC.gymID = self.id
                    nftVC.status = BigUInt(self.NFTs[indexPath.row].status)
                    nftVC.tokenID = BigUInt(self.NFTs[indexPath.row].id)
                    nftVC.location = self.location
                    nftVC.cameFromScanningVC = self.cameFromScanningVC
                    nftVC.image = self.changeSVG(self.NFTs[indexPath.row].image, width: 1000, height: 1000, viewBox: "0 0 200 200", fontSize: 14)
                    nftVC.delegate = self
                    
                    self.navigationController?.pushViewController(nftVC, animated: true)
                    
                }
            }
    }
    
    func changeSVG(_ string: String, width: Int, height: Int, viewBox: String, fontSize: Int) -> String {
        
        let svgParameters = [
            "viewBox=\"[^\"]+\"": "viewBox=\"\(viewBox)\"",
            "font-size:\\s?\\d+px": "font-size: \(fontSize)px"
        ]

        var newSVG = string
        for (x, y) in svgParameters{
            if let regex = try? NSRegularExpression(pattern: x){
                newSVG = regex.stringByReplacingMatches(in: newSVG, range: NSRange(location: 0, length: newSVG.count), withTemplate: y)
            }
        }
        newSVG = newSVG.replacingOccurrences(of: "preserveAspectRatio=\"xMinYMin meet\"", with: "width=\"\(width)\" height=\"\(height)\"")

        return newSVG
    }
    
    func createSummary() -> Summary{
        let countNFT = NFTs.count
        var countActive: Int = 0
        
        
        
        
        if NFTs.count != 0{
            var gymName: String = ""
            for i in NFTs{
                if i.status == "1"{
                    countActive += 1
                    gymName = i.gym
                }
            }
            let summary = Summary(id: id!, nameOfGym: retrieveNameOfGym(), allNFTs: countNFT, activeNFTs: countActive)
            return summary
        }
        else{
            return Summary(id: 0, nameOfGym: "Insuccessful load", allNFTs: 0, activeNFTs: 0)
        }
    }
    
    func retrieveNameOfGym() -> String{
        var nameOfGym: String = ""
        for i in NFTs{
            if nameOfGym.isEmpty{
                nameOfGym = i.gym
            }
            else{
                break
            }
        }
        return nameOfGym
    }
    
    public func loadData() -> [Summary] {
        let documentsURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        let fileURL = documentsURL.appendingPathComponent("summaryData.json")
        
        guard let data = try? Data(contentsOf: fileURL) else {
            return []
        }
        
        do {
            let summaries = try JSONDecoder().decode([Summary].self, from: data)

            return summaries
        } catch {
            print("Error decoding data: \(error)")
            return []
        }
    }

    
    public func saveData(_ NFTsums: [Summary]){
        let documentsURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        let fileURL = documentsURL.appendingPathComponent("summaryData.json")

        do {
            let jsonEncoder = JSONEncoder()
            let jsonData = try jsonEncoder.encode(NFTsums)

            try jsonData.write(to: fileURL)
        } catch {
            print("Error encoding data: \(error)")
        }
    }

    
    
    func handleAfterScan() {
      let newSummary = createSummary()
        var summaries = summary.load(walletAddress: Connect.connection.metamaskSDK.account)
      if let idx = summaries.firstIndex(where: { $0.id == newSummary.id }) {
        summaries[idx] = newSummary
      } else {
        summaries.append(newSummary)
      }
        summary.save(summaries, walletAddress: Connect.connection.metamaskSDK.account)
//      NotificationCenter.default.post(name: .summariesDidChange, object: nil)
      print("save completed!")
    }
    
    func clearSummaries() {
        let addr = Connect.connection.metamaskSDK.account
        summary.clear(walletAddress: addr)
        print("Summary file deleted for wallet: \(addr)")
    }


    
}



class Cell: UICollectionViewCell {

    let image = WKWebView()
    
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = .white
        
        image.contentMode = .scaleAspectFit
        image.translatesAutoresizingMaskIntoConstraints = false
        image.isUserInteractionEnabled = false
        
        contentView.addSubview(image)
        
        NSLayoutConstraint.activate([
            image.centerXAnchor.constraint(equalTo: contentView.centerXAnchor),
            image.centerYAnchor.constraint(equalTo: contentView.centerYAnchor),
            image.widthAnchor.constraint(equalTo: contentView.widthAnchor),
            image.heightAnchor.constraint(equalTo: contentView.heightAnchor)
        ])

    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}


struct Summary: Codable{
    var id: BigUInt
    var nameOfGym: String
    var allNFTs: Int
    var activeNFTs: Int
}



