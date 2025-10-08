import UIKit
import Web3
import BigInt
import WebKit

class NFT: UIViewController{
    
    
    var status: BigUInt?
    var tariff: String?
    var date: BigUInt?
    var visits: BigUInt?
    var gymID: BigUInt?
    var tokenID: BigUInt?
    var image: String?
    var location: String?
    
    let nft = WKWebView()
    
    let pauseButton = UIButton()
    let writeOffButton = UIButton()
    
    var cameFromScanningVC: Bool?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        view.backgroundColor = .white
        
        nft.loadHTMLString(image!, baseURL: nil)
        
        nft.contentMode = .scaleAspectFit
        nft.translatesAutoresizingMaskIntoConstraints = false
        nft.isUserInteractionEnabled = false
        
        pauseButton.backgroundColor = .black
        pauseButton.layer.cornerRadius = 10
        
        if status == 1{
            pauseButton.backgroundColor = .white
            pauseButton.layer.borderColor = UIColor.black.cgColor
            pauseButton.layer.borderWidth = 1.0
            pauseButton.setTitle("Pause", for: .normal)
            pauseButton.setTitleColor(.black, for: .normal)
        }
        else{
            pauseButton.backgroundColor = .black
            pauseButton.setTitle("Unpause", for: .normal)
            pauseButton.setTitleColor(.white, for: .normal)
        }
        
        pauseButton.addTarget(self, action: #selector(pause), for: .touchUpInside)
        pauseButton.translatesAutoresizingMaskIntoConstraints = false
        pauseButton.addTarget(self, action: #selector(pause), for: .touchUpInside)
        
        writeOffButton.layer.cornerRadius = 10
        writeOffButton.backgroundColor = .black
        writeOffButton.setTitle("Write off", for: .normal)
        writeOffButton.setTitleColor(.white, for: .normal)
        
        writeOffButton.addTarget(self, action: #selector(writeOff), for: .touchUpInside)
        
        writeOffButton.translatesAutoresizingMaskIntoConstraints = false
        
        writeOffButton.translatesAutoresizingMaskIntoConstraints = false
        
        
        view.addSubview(writeOffButton)
        
        
        view.addSubview(pauseButton)
        
        
        view.addSubview(nft)
        
        
        NSLayoutConstraint.activate([
            nft.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 0),
            nft.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            nft.widthAnchor.constraint(equalToConstant: 300),
            nft.heightAnchor.constraint(equalToConstant: 300),
            
        ])
        
        
        NSLayoutConstraint.activate([
            
            pauseButton.topAnchor.constraint(equalTo: nft.bottomAnchor, constant: 20),
            pauseButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            pauseButton.widthAnchor.constraint(equalToConstant: 170),
            pauseButton.heightAnchor.constraint(equalToConstant: 50),
            
            writeOffButton.topAnchor.constraint(equalTo: nft.bottomAnchor, constant: 20),
            writeOffButton.leadingAnchor.constraint(equalTo: pauseButton.trailingAnchor, constant: 10),
            writeOffButton.widthAnchor.constraint(equalToConstant: 170),
            writeOffButton.heightAnchor.constraint(equalToConstant: 50),
            
        ])
        
    }
    
    
    weak var delegate: NFTDelegate?
    
    @objc func pause(sender: UIButton){
        let addr = Connect.connection.metamaskSDK.account
        
        HomeVC().buttonScaling(button: sender) {
            if !addr.isEmpty {
                Task {
                    self.formHash(txHash: try await Connect.connection.pauseMembership(gymID: self.gymID!, NFTID: self.tokenID!, status: self.status!, tariff: self.tariff!, date: self.date!, visits: self.visits!))
                }
            }
            self.ref()
        }
    }
    
    func formHash(txHash: String){
        do {
            print("Submitted tx:", txHash)
        } catch {
            print("Error sending tx:", error)
        }
    }
    
    
    
    @objc func writeOff(sender: UIButton) {
        let addr = Connect.connection.metamaskSDK.account
        
        func showAlert(message: String) {
            let alert = UIAlertController(title: "No permission to write off visit", message: message, preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            self.present(alert, animated: true)
            self.navigationController?.popViewController(animated: true)
        }
        
        HomeVC().buttonScaling(button: sender) {
            guard let cameFromScanning = self.cameFromScanningVC, cameFromScanning else {
                showAlert(message: "You are able to write off visit only after scanning QR code in the gym")
                return
            }
            
            guard self.tariff == "Ultima" || self.tariff == self.location else {
                showAlert(message: "You can't manage this membership. Choose another NFT or buy another one with appropriate tariff for this location")
                return
            }
            
            guard !addr.isEmpty && self.status == 1 else {
                if addr.isEmpty {
                    showAlert(message: "Connect your wallet first")
                } else {
                    showAlert(message: "Unpause your membership first")
                }
                return
            }
            
            Task {
                do {
                    let txHash = try await Connect.connection.writeOffVisit(gymID: self.gymID!, NFTID: self.tokenID!, status: self.status!,tariff: self.tariff!, date: self.date!, visits: self.visits!
                    )
                    self.formHash(txHash: txHash)
                    self.ref()
                } catch {
                    showAlert(message: "Failed to write off visit: \(error.localizedDescription)")
                }
            }
        }
    }

        
    func ref(){
            DispatchQueue.main.asyncAfter(deadline: .now() + 60){
                self.delegate?.didUpdateData()
            }
        }
        
    
    protocol NFTDelegate: AnyObject {
        func didUpdateData()
    }
    
}
