import UIKit

class NoInternetVC: UIViewController{
    
    let internetLogo = UIImageView(image: UIImage(systemName: "wifi.slash"))
    let noConnection = UILabel()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        
        internetLogo.contentMode = .scaleAspectFit
        internetLogo.translatesAutoresizingMaskIntoConstraints = false
        internetLogo.tintColor = .systemGray4
        
        noConnection.textColor = .systemGray4
        noConnection.text = "No internet connection, check it"
        noConnection.translatesAutoresizingMaskIntoConstraints = false
        
        view.addSubview(internetLogo)
        view.addSubview(noConnection)
        
        NSLayoutConstraint.activate([
            internetLogo.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            internetLogo.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            internetLogo.widthAnchor.constraint(equalToConstant: 120),
            internetLogo.heightAnchor.constraint(equalToConstant: 120),
            
            noConnection.topAnchor.constraint(equalTo: internetLogo.bottomAnchor, constant: 20),
            noConnection.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            noConnection.widthAnchor.constraint(equalToConstant: 250),
            noConnection.heightAnchor.constraint(equalToConstant: 50),
        ])
        
    }
}

