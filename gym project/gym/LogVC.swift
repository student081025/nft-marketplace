import UIKit

class LogVC: UIViewController {
    
    let buttonLog = UIButton()
    let buttonSign = UIButton()
    
    let welcomeLabel = UILabel()
    let alreadyLabel = UILabel()
    
    let image = UIImageView()


    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        
        buttonLog.setTitle("Log in with MetaMask", for: .normal)
        buttonLog.backgroundColor = .white
        buttonLog.setTitleColor(.black, for: .normal)
        buttonLog.layer.borderColor = UIColor.black.cgColor
        buttonLog.layer.borderWidth = 2.0
        buttonLog.layer.cornerRadius = 20
        buttonLog.addTarget(self, action: #selector(enteredLogin), for: .touchUpInside)
        
        buttonSign.setTitle("Let's get started", for: .normal)
        buttonSign.backgroundColor = .black
        buttonSign.setTitleColor(.white, for: .normal)
        buttonSign.layer.cornerRadius = 20
        buttonSign.addTarget(self, action: #selector(switchToIntro), for: .touchUpInside)
        
        welcomeLabel.textColor = .black
        welcomeLabel.text = "Manage your subscriptions"
        welcomeLabel.numberOfLines = 0
        welcomeLabel.font = .systemFont(ofSize: 25, weight: .bold)
        welcomeLabel.minimumScaleFactor = 0.5
        welcomeLabel.textAlignment = .center
        
        
        image.image = UIImage(systemName: "list.bullet.rectangle")
        image.contentMode = .scaleAspectFit
        image.tintColor = .black
        image.translatesAutoresizingMaskIntoConstraints = false
        
        view.addSubview(buttonLog)
        view.addSubview(welcomeLabel)
        view.addSubview(buttonSign)
        view.addSubview(image)
        
        buttonLog.translatesAutoresizingMaskIntoConstraints = false
        buttonSign.translatesAutoresizingMaskIntoConstraints = false
        welcomeLabel.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            buttonLog.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            buttonLog.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -165),
            buttonLog.widthAnchor.constraint(equalToConstant: 320),
            buttonLog.heightAnchor.constraint(equalToConstant: 60),
            
            buttonSign.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            buttonSign.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -90),
            buttonSign.widthAnchor.constraint(equalToConstant: 320),
            buttonSign.heightAnchor.constraint(equalToConstant: 60),
            
            welcomeLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            welcomeLabel.centerYAnchor.constraint(equalTo: view.centerYAnchor, constant: -200),
            welcomeLabel.widthAnchor.constraint(equalToConstant: 300),
            welcomeLabel.heightAnchor.constraint(equalToConstant: 70),
            
            image.centerXAnchor.constraint(equalTo: welcomeLabel.centerXAnchor),
            image.centerYAnchor.constraint(equalTo: welcomeLabel.centerYAnchor, constant: 150),
            image.widthAnchor.constraint(equalToConstant: 150),
            image.heightAnchor.constraint(equalToConstant: 150)
        ])
        
        
        Timer.scheduledTimer(withTimeInterval: 2.0, repeats: true) { [weak self] _ in
                    self?.switchIcon()
        }
        
    }
    
    
    @objc func enteredLogin(sender: UIButton!)
    {
        
        HomeVC().buttonScaling(button: sender){
            Task{
                let metamask = Connect.connection
                await metamask.connectToMetamask()
                if metamask.metamaskSDK.account != ""{
                    UserDefaults.standard.set(true, forKey: "loggedIn")
                    if let sceneDelegate = UIApplication.shared.connectedScenes.first?.delegate as? SceneDelegate {
                        sceneDelegate.setUp()
                    }
    //                NotificationCenter.default.post(name: .metamaskDidConnect, object: nil)
                }
                else {
                    self.showAlert()
                }
            }
        }

    }
    
    @objc private func switchIcon() {
            let newName = (image.image == UIImage(systemName: "list.bullet.rectangle"))
                ? "dumbbell.fill"
                : "list.bullet.rectangle"

            let transition = CATransition()
            transition.duration = 0.3
            transition.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)
            transition.type = .fade
            image.layer.add(transition, forKey: kCATransition)

            image.image = UIImage(systemName: newName)
    }
    
    
    @objc func switchToIntro(sender: UIButton!){
        HomeVC().buttonScaling(button: sender){
            UserDefaults.standard.set(true, forKey: "firstLog")
            if let sceneDelegate = UIApplication.shared.connectedScenes.first?.delegate as? SceneDelegate {
                sceneDelegate.setUp()
            }
        }

    }
    
    func showAlert() {
        let alert = UIAlertController(
            title: "Error with MetaMask",
            message: "Something went wrong with connection to MetaMask. Please try again later.",
            preferredStyle: .alert
        )
        
        
        alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
            print("OK tapped")
        })
        
        present(alert, animated: true, completion: nil)
    }
    
}
