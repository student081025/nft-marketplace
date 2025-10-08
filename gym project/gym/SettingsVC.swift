import UIKit

class SettingsVC: UIViewController {
    
    let logOutButtong = UIButton()
    let changeAccButton = UIButton()
    let titleLabel = UILabel()
    let details = UILabel()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        
        titleLabel.text = "Account settings"
        titleLabel.textColor = .black
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        titleLabel.font = UIFont.systemFont(ofSize: 20, weight: .bold)
        
        logOutButtong.setTitle("Log out", for: .normal)
        logOutButtong.setTitleColor(.black, for: .normal)
        logOutButtong.backgroundColor = .white
        logOutButtong.layer.borderWidth = 2.0
        logOutButtong.layer.borderColor = UIColor.black.cgColor
        logOutButtong.layer.cornerRadius = 10
        logOutButtong.addTarget(self, action: #selector(logOut), for: .touchUpInside)
        
        changeAccButton.setTitle("Change account", for: .normal)
        changeAccButton.setTitleColor(.black, for: .normal)
        changeAccButton.backgroundColor = .white
        changeAccButton.layer.borderColor = UIColor.black.cgColor
        changeAccButton.layer.borderWidth = 2.0
        changeAccButton.layer.cornerRadius = 10
        changeAccButton.addTarget(self, action: #selector(changingAcc), for: .touchUpInside)
        
        details.textColor = .darkGray
        details.translatesAutoresizingMaskIntoConstraints = false
        
//        NotificationCenter.default.addObserver(self, selector: #selector(reloadSet), name: .metamaskDidConnect, object: nil)
        
        view.addSubview(titleLabel)
        view.addSubview(details)
        
        logOutButtong.translatesAutoresizingMaskIntoConstraints = false
        changeAccButton.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            
            titleLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            titleLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 30),
            titleLabel.widthAnchor.constraint(equalToConstant: 170),
            titleLabel.heightAnchor.constraint(equalToConstant: 30),
            
            details.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            details.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 20),
            details.heightAnchor.constraint(equalToConstant: 30)
        ])

    }
    
    func shorten(address: String) -> String {

        let body = address.dropFirst(2)
        let start = body.prefix(5)
        let end = body.suffix(5)
        return "0x" + start + "…" + end
    }
    
    
    deinit {
        NotificationCenter.default.removeObserver(self)
    }

    @objc func reloadSet() {
        if Connect.connection.metamaskSDK.connected {
            details.text = "Wallet: " + shorten(address: Connect.connection.metamaskSDK.account)
          if logOutButtong.superview == nil {
            view.addSubview(logOutButtong)
            view.addSubview(changeAccButton)
            NSLayoutConstraint.activate([
              logOutButtong.centerXAnchor.constraint(equalTo: view.centerXAnchor),
              logOutButtong.topAnchor.constraint(equalTo: details.safeAreaLayoutGuide.topAnchor, constant: 50),
              logOutButtong.widthAnchor.constraint(equalToConstant: 300),
              logOutButtong.heightAnchor.constraint(equalToConstant: 50),
              
              changeAccButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
              changeAccButton.topAnchor.constraint(equalTo: logOutButtong.topAnchor, constant: 70),
              changeAccButton.widthAnchor.constraint(equalToConstant: 300),
              changeAccButton.heightAnchor.constraint(equalToConstant: 50),
            ])
          }
        } else {
            details.text = "No MetaMask wallet connected"
            logOutButtong.removeFromSuperview()
            changeAccButton.removeFromSuperview()
        }
      }
    
    override func viewWillAppear(_ animated: Bool) {
      super.viewWillAppear(animated)
      reloadSet()
    }

    
    @objc func logOut(sender: UIButton!) {
        Connect.connection.metamaskSDK.disconnect()
        Connect.connection.metamaskSDK.clearSession()
        
        let shownft = showNFTVC()
        shownft.clearSummaries()


        UserDefaults.standard.set(false, forKey: "loggedIn")

        NotificationCenter.default.post(name: .userDidLogOut, object: nil)

        if let scene = UIApplication.shared.connectedScenes
                   .first?.delegate as? SceneDelegate {
            scene.setUp()
        }
    }

    
    @objc func changingAcc(sender: UIButton!) {
        Task {
            await handleChangingAcc()
        }
    }

    private func handleChangingAcc() async {
        let share = Connect.connection
        let msk = Connect.connection.metamaskSDK
        
        if !msk.account.isEmpty {
            msk.disconnect()
            msk.clearSession()
            
            let _ = await share.connectToMetamask()
            
            DispatchQueue.main.async {
                self.reloadSet()
            }
        }
    }
    
    
}

extension Notification.Name {
    static let userDidLogOut = Notification.Name("userDidLogOut")
}




