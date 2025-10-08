import UIKit
import SafariServices

class IntroVC: UIViewController, SFSafariViewControllerDelegate {
    
    let yesButton = UIButton()
    let noButton = UIButton()
    let explanation = UILabel()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        
        noButton.backgroundColor = .white
        noButton.setTitle("I have no gym subscriptions", for: .normal)
        noButton.setTitleColor(.black, for: .normal)
        noButton.addTarget(self, action: #selector(goToMarketplace), for: .touchUpInside)
        noButton.layer.cornerRadius = 10
        noButton.layer.borderColor = UIColor.black.cgColor
        noButton.layer.borderWidth = 2.0
        
        yesButton.backgroundColor = .white
        yesButton.setTitle("Already have a subscription", for: .normal)
        yesButton.setTitleColor(.black, for: .normal)
        yesButton.addTarget(self, action: #selector(goFurther), for: .touchUpInside)
        yesButton.layer.cornerRadius = 10
        yesButton.layer.borderColor = UIColor.black.cgColor
        yesButton.layer.borderWidth = 2.0
        
        noButton.translatesAutoresizingMaskIntoConstraints = false
        yesButton.translatesAutoresizingMaskIntoConstraints = false
        explanation.translatesAutoresizingMaskIntoConstraints = false
        
        
        explanation.textAlignment = .center
        explanation.text = "If you do not have any subscriptions, you will need to go to the NFT marketplace website in order to purchase your first membership"
        explanation.textColor = .black
        explanation.numberOfLines = 6
        explanation.font = .systemFont(ofSize: 20, weight: .bold)
        
        
        view.addSubview(noButton)
        view.addSubview(yesButton)
        view.addSubview(explanation)
        
        NSLayoutConstraint.activate([
            yesButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            yesButton.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -90),
            yesButton.widthAnchor.constraint(equalToConstant: 320),
            yesButton.heightAnchor.constraint(equalToConstant: 60),
            
            noButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            noButton.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -165),
            noButton.widthAnchor.constraint(equalToConstant: 320),
            noButton.heightAnchor.constraint(equalToConstant: 60),
            
            explanation.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            explanation.centerYAnchor.constraint(equalTo: view.centerYAnchor),
//            explanation.heightAnchor.constraint(equalToConstant: 100),
            explanation.widthAnchor.constraint(equalTo: view.widthAnchor, multiplier: 0.8)
        ])
        
        
    }


    
    @objc func goToMarketplace(sender: UIButton!){
        
        HomeVC().buttonScaling(button: sender){
            self.directlyToWeb()
        }
    }
    
    func directlyToWeb(){
        guard let url = URL(string: "https://app-1-kappa.vercel.app") else {
            print("Invalid URL")
            return
        }
        let safariVC = SFSafariViewController(url: url)
        safariVC.delegate = self
        present(safariVC, animated: true, completion: nil)
    }
    
    
    
    @objc func goFurther(sender: UIButton!){
        HomeVC().buttonScaling(button: sender){
            self.navigationController?.pushViewController(IntroConnectVC(), animated: true)
        }
    }
}




class IntroConnectVC: UIViewController {
    
    let connectButton = UIButton()
    let downloadButton = UIButton()
    var metamaskImage = UIImageView()
    var text = UILabel()
    let textExplanation = UILabel()
    let textExplanationDownload = UILabel()

    override func viewDidLoad() {
        super.viewDidLoad()
        
        view.backgroundColor = .white
        title = "Authorization using Metamask"
        self.navigationController?.navigationBar.titleTextAttributes = [
                .foregroundColor: UIColor.black
            ]
        
        self.navigationController?.navigationBar.tintColor = .black
        

        
        metamaskImage.image = UIImage(named: "MetaMask-icon-fox")
        metamaskImage.translatesAutoresizingMaskIntoConstraints = false
        
        connectButton.backgroundColor = .black
        connectButton.layer.cornerRadius = 10
        connectButton.setTitle("Connect to wallet", for: .normal)
        connectButton.setTitleColor(.white, for: .normal)
        connectButton.addTarget(self, action: #selector(connectButtonTapped), for: .touchUpInside)
        
        downloadButton.backgroundColor = .white
        downloadButton.setTitleColor(.black, for: .normal)
        downloadButton.setTitle("Download MetaMask", for: .normal)
        downloadButton.layer.cornerRadius = 10
        downloadButton.addTarget(self, action: #selector(downloadButtonTapped), for: .touchUpInside)
        downloadButton.layer.borderWidth = 2.0
        downloadButton.layer.borderColor = UIColor.black.cgColor
        
        connectButton.translatesAutoresizingMaskIntoConstraints = false
        downloadButton.translatesAutoresizingMaskIntoConstraints = false
        
        text.textColor = .black
        text.translatesAutoresizingMaskIntoConstraints = false
        text.text = "Connect your wallet to continue"
        text.font = UIFont.systemFont(ofSize: 20, weight: .bold)
        
        textExplanation.textColor = .darkGray
        textExplanation.translatesAutoresizingMaskIntoConstraints = false
        textExplanation.text = "To access all features, you’ll need MetaMask — your secure “digital key” for the app. It lets you confirm actions safely and protects your data"
        textExplanation.numberOfLines = 5
        textExplanation.textAlignment = .center
        textExplanation.font = UIFont.systemFont(ofSize: 18.5)
        
        textExplanationDownload.textColor = .gray
        textExplanationDownload.translatesAutoresizingMaskIntoConstraints = false
        textExplanationDownload.text = "If you don't have MetaMask installed, please download it from the App Store"
        textExplanationDownload.numberOfLines = 2
        textExplanationDownload.textAlignment = .center
        textExplanationDownload.font = UIFont.systemFont(ofSize: 18)

        
        view.addSubview(connectButton)
        view.addSubview(downloadButton)
        view.addSubview(metamaskImage)
        view.addSubview(text)
        view.addSubview(textExplanation)
        view.addSubview(textExplanationDownload)
        
        NSLayoutConstraint.activate([
            connectButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            connectButton.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -90),
            connectButton.widthAnchor.constraint(equalToConstant: 320),
            connectButton.heightAnchor.constraint(equalToConstant: 60),
            
            downloadButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            downloadButton.topAnchor.constraint(equalTo: connectButton.topAnchor, constant: -75),
            downloadButton.widthAnchor.constraint(equalToConstant: 320),
            downloadButton.heightAnchor.constraint(equalToConstant: 60),
            
            metamaskImage.centerXAnchor.constraint(equalToSystemSpacingAfter: view.centerXAnchor, multiplier: 0.5),
            metamaskImage.topAnchor.constraint(equalTo: view.topAnchor, constant: 100),
            metamaskImage.widthAnchor.constraint(equalToConstant: 250),
            metamaskImage.heightAnchor.constraint(equalToConstant: 250),
            
            text.centerXAnchor.constraint(equalToSystemSpacingAfter: metamaskImage.centerXAnchor, multiplier: 0.5),
            text.centerYAnchor.constraint(equalTo: metamaskImage.bottomAnchor, constant: 80),
            text.heightAnchor.constraint(equalToConstant: 50),
            text.widthAnchor.constraint(equalTo: view.widthAnchor, multiplier: 0.8),
            
            textExplanation.centerXAnchor.constraint(equalToSystemSpacingAfter: metamaskImage.centerXAnchor, multiplier: 0.5),
            textExplanation.centerYAnchor.constraint(equalTo: text.bottomAnchor, constant: 55),
            textExplanation.heightAnchor.constraint(equalToConstant: 150),
            textExplanation.widthAnchor.constraint(equalTo: text.widthAnchor),
            
            textExplanationDownload.centerXAnchor.constraint(equalToSystemSpacingAfter: metamaskImage.centerXAnchor, multiplier: 0.5),
            textExplanationDownload.centerYAnchor.constraint(equalTo: downloadButton.topAnchor, constant: -40),
            textExplanationDownload.heightAnchor.constraint(equalToConstant: 200),
            textExplanationDownload.widthAnchor.constraint(equalTo: text.widthAnchor)
        ])
    }
    
    private func setupUI() {
        view.backgroundColor = .white
              
        }
          
    @objc private func connectButtonTapped(sender: UIButton) {
            
            HomeVC().buttonScaling(button: sender){
                Task {
                    let connect = Connect.connection
                    let metamask = connect.metamaskSDK
                    await connect.connectToMetamask()
                    if metamask.connected {
                        self.text.text = "Connected"
                        if !metamask.account.isEmpty {
                            UserDefaults.standard.set(metamask.account, forKey: "walletAddress")
                        }
                        UserDefaults.standard.set(false, forKey: "firstLog")
                        UserDefaults.standard.set(true, forKey: "loggedIn")
                        if let sceneDelegate = UIApplication.shared.connectedScenes.first?.delegate as? SceneDelegate {
                            sceneDelegate.setUp()
                        }
                    }
                    else{
                        self.text.text = "Disconnected"
                    }
                }
            }
        }
    
    

        
    @objc private func downloadButtonTapped(sender: UIButton) {
        HomeVC().buttonScaling(button: sender){
            let metaMaskAppID = "1438144202"
                let urlString = "https://apps.apple.com/app/id\(metaMaskAppID)"
                
                guard let url = URL(string: urlString), UIApplication.shared.canOpenURL(url) else {
                    print("Ссылка недоступна")
                    return
                }
                
                UIApplication.shared.open(url, options: [:])
        }
    }
    

}

class IntroInfoVC: UIViewController, UITextFieldDelegate{
    let nameQuestion = UILabel()
    let inputName = UITextField()
    let approveButton = UIButton()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        view.backgroundColor = .white
        
        nameQuestion.text = "What is your name?"
        nameQuestion.textColor = .black
        nameQuestion.textAlignment = .center
        nameQuestion.translatesAutoresizingMaskIntoConstraints = false
        nameQuestion.font = .systemFont(ofSize: 25, weight: .bold)
        
        inputName.attributedPlaceholder = NSAttributedString(string: "Input your name", attributes: [NSAttributedString.Key.foregroundColor: UIColor.systemGray3])
        
        inputName.borderStyle = .roundedRect
        inputName.delegate = self
        inputName.backgroundColor = .black
        inputName.textColor = .white
        
        approveButton.backgroundColor = .black
        approveButton.setTitle("Complete setting up", for: .normal)
        approveButton.translatesAutoresizingMaskIntoConstraints = false
        approveButton.layer.cornerRadius = 10
        approveButton.setTitleColor(.white, for: .normal)
        approveButton.addTarget(self, action: #selector(loadName), for: .touchUpInside)
        
        inputName.translatesAutoresizingMaskIntoConstraints = false
        approveButton.translatesAutoresizingMaskIntoConstraints = false
        
        view.addSubview(nameQuestion)
        view.addSubview(inputName)
        view.addSubview(approveButton)
        
        NSLayoutConstraint.activate([
            nameQuestion.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 60),
            nameQuestion.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 20),
            nameQuestion.widthAnchor.constraint(equalToConstant: 250),
            nameQuestion.heightAnchor.constraint(equalToConstant: 50)
        ])
        
        NSLayoutConstraint.activate([
            inputName.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            inputName.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 100),
            inputName.widthAnchor.constraint(equalToConstant: 320),
            inputName.heightAnchor.constraint(equalToConstant: 60)
        ])
        
        NSLayoutConstraint.activate([
            approveButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            approveButton.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 180),
            approveButton.widthAnchor.constraint(equalToConstant: 320),
            approveButton.heightAnchor.constraint(equalToConstant: 60)
        ])
    }
    
    private func textFieldAddr(_ textField: UITextField) -> String {
        return inputName.text!
    }
    @objc func loadName() {
        if inputName.text?.isEmpty != true {
            UserDefaults.standard.set(inputName.text, forKey: "username")
        }
        else{
            inputName.attributedPlaceholder = NSAttributedString(string: "Enter your name, please!", attributes: [NSAttributedString.Key.foregroundColor: UIColor.red])
        }
        UserDefaults.standard.set(false, forKey: "firstLog")
        UserDefaults.standard.set(true, forKey: "loggedIn")
        if let sceneDelegate = UIApplication.shared.connectedScenes.first?.delegate as? SceneDelegate {
            sceneDelegate.setUp()
        }
    }
}

