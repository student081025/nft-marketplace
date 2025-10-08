import Web3
import VisionKit
import UIKit
import Web3PromiseKit
import Web3ContractABI
import BigInt
import WebKit
import Foundation

class HomeVC: UIViewController, UITableViewDataSource, UITableViewDelegate{
    
    let greeting = UILabel()
    let scanQR = UIButton()
    
    let connectionStatus = UILabel()
    
    let connectButton = UIButton()
    
    let summariesTV = UITableView()
    
    var summaries: [Summary] = []
    
    var HC: NSLayoutConstraint?
    
    func configureTableView(){
        summariesTV.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(summariesTV)
        summariesTV.dataSource = self
        summariesTV.delegate = self
        
        summariesTV.layer.borderColor = UIColor.black.cgColor
        summariesTV.layer.borderWidth = 0.7

        
        summariesTV.register(CellTV.self, forCellReuseIdentifier: "cell")
        summariesTV.rowHeight  = 130
        
        summariesTV.layer.cornerRadius = 10
        
        
        HC = summariesTV.heightAnchor.constraint(equalToConstant: 0)
        HC?.isActive = true
        
    }

    
    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        
        summariesTV.layoutIfNeeded()
        let contentHeight = summariesTV.contentSize.height
        HC?.constant = contentHeight
    }
    
    
    var id: BigUInt = 0
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        
//        NotificationCenter.default.addObserver(self, selector: #selector(handleLogout),       name: .userDidLogOut,        object: nil)
//        NotificationCenter.default.addObserver(self, selector: #selector(reloadSummaries),    name: .summariesDidChange,    object: nil)
//        NotificationCenter.default.addObserver(self, selector: #selector(handleWalletConnected), name: .metamaskDidConnect, object: nil)


        
        summariesTV.backgroundColor = .white
        
        navigationController?.navigationBar.tintColor = .black
        
        summaries = summary.load(walletAddress: Connect.connection.metamaskSDK.account)
        
        greeting.text = greet()
        greeting.font = .systemFont(ofSize: 25, weight: .bold)
        greeting.textColor = .black
        
        
        connectButton.layer.cornerRadius = 10
        connectButton.backgroundColor = .black
        connectButton.setTitle("Connect your MetaMask wallet", for: .normal)
        connectButton.setTitleColor(.white, for: .normal)
        connectButton.addTarget(self, action: #selector(connecting), for: .touchUpInside)
        
        connectButton.translatesAutoresizingMaskIntoConstraints = false

        
        scanQR.setTitle("Scan QR-code of your gym", for: .normal)
        scanQR.backgroundColor = .black
        scanQR.setTitleColor(.white, for: .normal)
        scanQR.addTarget(self, action: #selector(scanning), for: .touchUpInside)
        scanQR.layer.cornerRadius = 10
        scanQR.titleLabel?.font = .systemFont(ofSize: 20)
        
        greeting.translatesAutoresizingMaskIntoConstraints = false
        scanQR.translatesAutoresizingMaskIntoConstraints = false
        
        
        view.addSubview(greeting)
        view.addSubview(connectionStatus)
        
        configureTableView()
        summariesTV.isHidden = summaries.isEmpty
        summariesTV.reloadData()
        
        checkIfConnected()
        settingUpConsraints()

        
    }
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }
    
    @objc private func handleLogout() {
      summaries.removeAll()
      summariesTV.isHidden = true
      summariesTV.reloadData()
    }
    
    @objc private func reloadSummaries() {
        summaries = summary.load(walletAddress: Connect.connection.metamaskSDK.account)
        summariesTV.isHidden = summaries.isEmpty
        summariesTV.reloadData()
        
        DispatchQueue.main.async {
            self.summariesTV.layoutIfNeeded()
            self.HC?.constant = self.summariesTV.contentSize.height
            self.view.layoutIfNeeded()
        }
    }
    
    
    @objc private func handleWalletConnected() {

        let newWallet = Connect.connection.metamaskSDK.account
        summaries = summary.load(walletAddress: newWallet)

        summariesTV.isHidden = summaries.isEmpty
        summariesTV.reloadData()

        DispatchQueue.main.async {
            self.summariesTV.layoutIfNeeded()
            self.HC?.constant = self.summariesTV.contentSize.height
            self.view.layoutIfNeeded()
        }

        checkIfConnected()
        
    }


    
    
    
    func settingUpConsraints(){
        NSLayoutConstraint.activate([
            greeting.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            greeting.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 0),
            greeting.widthAnchor.constraint(lessThanOrEqualToConstant: 300),
            greeting.heightAnchor.constraint(equalToConstant: 50),
            
            connectionStatus.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            connectionStatus.topAnchor.constraint(equalTo: greeting.bottomAnchor, constant: 10),
        ])

    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        reloadSummaries()
    }
    
    func checkIfConnected(){
        if !Connect.connection.metamaskSDK.connected{
            
            view.addSubview(connectButton)
            
            
            NSLayoutConstraint.activate([
                connectButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
                connectButton.topAnchor.constraint(equalTo: greeting.bottomAnchor, constant: 20),
                connectButton.widthAnchor.constraint(equalToConstant: 300),
                connectButton.heightAnchor.constraint(equalToConstant: 50),
                
                summariesTV.topAnchor.constraint(equalTo: connectButton.bottomAnchor, constant: 30),
                summariesTV.centerXAnchor.constraint(equalTo: connectButton.centerXAnchor),
                summariesTV.widthAnchor.constraint(equalTo: view.widthAnchor, multiplier: 0.9),
            ])

        }
        else{
            
            view.addSubview(scanQR)
            
            NSLayoutConstraint.activate([
                scanQR.centerXAnchor.constraint(equalTo: view.centerXAnchor),
                scanQR.topAnchor.constraint(equalTo: greeting.bottomAnchor, constant: 20),
                scanQR.widthAnchor.constraint(equalToConstant: 300),
                scanQR.heightAnchor.constraint(equalToConstant: 50),
                
                summariesTV.topAnchor.constraint(equalTo: scanQR.bottomAnchor, constant: 30),
                summariesTV.centerXAnchor.constraint(equalTo: scanQR.centerXAnchor),
                summariesTV.widthAnchor.constraint(equalTo: view.widthAnchor, multiplier: 0.9),
            ])

        }
    }
    
    
    public func buttonScaling(button: UIButton, completion: @escaping () -> Void) {
        UIView.animate(withDuration: 0.1, animations: {
            button.transform = CGAffineTransform(scaleX: 0.9, y: 0.9)
        }) { finished in
            UIView.animate(withDuration: 0.1, animations: {
                button.transform = CGAffineTransform.identity
            }) { finished in
                completion()
            }
        }
    }
    
    
    @objc func scanning(sender: UIButton!) {
        
        buttonScaling(button: sender){
            self.hidesBottomBarWhenPushed = true
            self.navigationController?.pushViewController(ScanningVC(), animated: true)
            self.hidesBottomBarWhenPushed = false
        }
    }
    
    @objc func connecting(sender: UIButton!) {
      buttonScaling(button: sender) {
        Task {
          await Connect.connection.connectToMetamask()
          self.checkIfConnected()
//          NotificationCenter.default.post(name: .metamaskDidConnect, object: nil)
        }
      }
    }

    
//    
//    func changeSVG(_ string: String, width: Int, height: Int, viewBox: String) -> String {
//        let svgParameters = [
//            "width=\"\\d+\"": "width=\"\(width)\"",
//            "height=\"\\d+\"": "height=\"\(height)\"",
//            "viewBox=\"[^\"]+\"": "viewBox=\"\(viewBox)\""
//        ]
//        
//        var newSVG = string
//        
//        for (x, y) in svgParameters{
//            if let regex = try? NSRegularExpression(pattern: x){
//                newSVG = regex.stringByReplacingMatches(in: newSVG, range: NSRange(location: 0, length: newSVG.count), withTemplate: y)
//            }
//        }
//        
//        return newSVG
//    }
    
    func greet() -> String{
        let hour = Calendar.current.component(.hour, from: Date())
        if hour < 4{
            return "Good night!"
        }
        else if hour < 12{
            return "Good morning!"
        }
        else if hour < 18{
            return "Good afternoon!"
        }
        else{
            return "Good evening!"
        }
    }
    
//    func retrieveName() -> String{
//        if let username = UserDefaults.standard.string(forKey: "username"){
//            return username
//        }
//        return ""
//    }
//    
//    func outputNameAndGreet() -> String{
//        if retrieveName().isEmpty{
//            return greet() + "!"
//        }
//        else{
//            return greet() + ", " + retrieveName() + "!"
//        }
//    }
    
    func retrieveAddr() -> String{
        if let addr = UserDefaults.standard.string(forKey: "walletAddress"){
            return addr
        }
        return ""
    }
    
    
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return summaries.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = summariesTV.dequeueReusableCell(withIdentifier: "cell", for: indexPath) as! CellTV
        cell.gymName.text = summaries[indexPath.row].nameOfGym
        cell.NFTnum.text = "All NFTs: \(summaries[indexPath.row].allNFTs)"
        cell.NFTact.text = "Active NFTs: \(summaries[indexPath.row].activeNFTs)"
        
        cell.deleteAction = { [weak self] in
            guard let self = self else { return }
            
            let alert = UIAlertController(title: "Delete subscription", message: "Do you want to delete subscription? You will need to scan QR-code again to add it", preferredStyle: UIAlertController.Style.alert)
            let cont = UIAlertAction(title: "Continue", style: UIAlertAction.Style.default){ _ in
                self.summaries.remove(at: indexPath.row)
                summary.save(self.summaries, walletAddress: Connect.connection.metamaskSDK.account)
                
                self.summariesTV.deleteRows(at: [indexPath], with: .fade)
                self.summariesTV.reloadData()
                
                if self.summaries.isEmpty {
                    self.summariesTV.isHidden = true
                }
            }
            alert.addAction(cont)
            alert.addAction(UIAlertAction(title: "Cancel", style: UIAlertAction.Style.cancel, handler: nil))
            self.present(alert, animated: true, completion: nil)


        }
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        guard let cell = tableView.cellForRow(at: indexPath) else { return }
        
        let summ = summaries[indexPath.row]
        let vc = showNFTVC()
        let addr = Connect.connection.metamaskSDK.account
        vc.tokens = Connect.connection.hasNFTToGym(summ.id, try! EthereumAddress(hex: addr, eip55: true))
        vc.id = summ.id
        vc.cameFromScanningVC = false
        
        self.navigationController?.pushViewController(vc, animated: true)
    }

}

class CellTV: UITableViewCell{
    var gymName     = UILabel()
    let NFTnum      = UILabel()
    let NFTact      = UILabel()
    let remove      = UIButton()
    
    var deleteAction: (() -> Void)?
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        
        contentView.backgroundColor = .white
        remove.layer.cornerRadius = 5
        remove.setTitle(" Delete", for: .normal)
        remove.backgroundColor = .black
        remove.setTitleColor(.white, for: .normal)
        remove.setImage(UIImage(systemName: "trash"), for: .normal)
        remove.tintColor = .white
        remove.addTarget(self, action: #selector(deleteSumm), for: .touchUpInside)
        
        gymName.font = .boldSystemFont(ofSize: 20)
        gymName.textColor = .black
        
        NFTnum.textColor = .black
        NFTact.textColor = .black
        NFTact.font = .boldSystemFont(ofSize: 17)
        
        
        NFTnum.translatesAutoresizingMaskIntoConstraints = false
        remove.translatesAutoresizingMaskIntoConstraints = false
        gymName.translatesAutoresizingMaskIntoConstraints = false
        NFTact.translatesAutoresizingMaskIntoConstraints = false
        

        
        contentView.addSubview(gymName)
        contentView.addSubview(NFTnum)
        contentView.addSubview(NFTact)
        contentView.addSubview(remove)
        
        NSLayoutConstraint.activate([
            remove.centerXAnchor.constraint(equalTo: contentView.centerXAnchor, constant: 100),
            remove.centerYAnchor.constraint(equalTo: contentView.centerYAnchor, constant: -20),
            remove.heightAnchor.constraint(equalTo: contentView.heightAnchor, multiplier: 0.3),
            remove.widthAnchor.constraint(equalTo: contentView.widthAnchor, multiplier: 0.3),
            
            gymName.centerXAnchor.constraint(equalTo: contentView.centerXAnchor, constant: -100),
            gymName.centerYAnchor.constraint(equalTo: contentView.centerYAnchor, constant: -30),
            gymName.heightAnchor.constraint(equalTo: contentView.heightAnchor, multiplier: 0.3),
            gymName.widthAnchor.constraint(equalTo: contentView.widthAnchor, multiplier: 0.3),
            
            NFTnum.centerXAnchor.constraint(equalTo: contentView.centerXAnchor, constant: -100),
            NFTnum.centerYAnchor.constraint(equalTo: contentView.centerYAnchor, constant: 10),
            NFTnum.heightAnchor.constraint(equalTo: contentView.heightAnchor, multiplier: 0.3),
            NFTnum.widthAnchor.constraint(equalTo: contentView.widthAnchor, multiplier: 0.3),
            
            NFTact.centerXAnchor.constraint(equalTo: contentView.centerXAnchor, constant: -85),
            NFTact.centerYAnchor.constraint(equalTo: contentView.centerYAnchor, constant: 35),
            NFTact.heightAnchor.constraint(equalTo: contentView.heightAnchor, multiplier: 0.3),
            NFTact.widthAnchor.constraint(equalTo: contentView.widthAnchor, multiplier: 0.4),
            
        ])
            
    }


    
    @objc func deleteSumm(sender: UIButton){
        
        HomeVC().buttonScaling(button: sender){
            self.deleteAction?()
        }
    }
    
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
}
//
//extension Notification.Name {
//  static let metamaskDidConnect = Notification.Name("metamaskDidConnect")
//    
//    static let summariesDidChange = Notification.Name("summariesDidChange")
//}

