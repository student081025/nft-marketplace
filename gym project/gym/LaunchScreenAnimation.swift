import UIKit

class LaunchScreenAnimation: UIViewController {
    
    let logo = UIImageView(image: UIImage(systemName: "figure.run.circle.fill"))
    let launchLabel = UILabel()
    let launchLabelAdditional = UILabel()
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        view.backgroundColor = .white
        
        logo.contentMode = .scaleAspectFit
        logo.translatesAutoresizingMaskIntoConstraints = false
        logo.tintColor = .black
        
        launchLabel.text = "AccessFit"
        launchLabel.font = .systemFont(ofSize: 20, weight: .bold)
        launchLabel.textColor = .black
        launchLabel.translatesAutoresizingMaskIntoConstraints = false

        
        launchLabelAdditional.text = "Get access to your gym subscriptions"
        launchLabelAdditional.font = .systemFont(ofSize: 15)
        launchLabelAdditional.textColor = .black
        launchLabelAdditional.translatesAutoresizingMaskIntoConstraints = false
        
        
        UIView.animate(withDuration: 0.5, animations: {
            
            self.logo.transform = CGAffineTransform(scaleX: 1.3, y: 1.3)}) {(finished) in
                UIView.animate(withDuration: 0.1, animations: {
                    self.logo.transform = CGAffineTransform.identity}) {(finished) in
                    }
            }
        view.addSubview(logo)
        view.addSubview(launchLabel)
        view.addSubview(launchLabelAdditional)
        
        NSLayoutConstraint.activate([
            logo.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            logo.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            logo.widthAnchor.constraint(equalToConstant: 240),
            logo.heightAnchor.constraint(equalToConstant: 128)
        ])
        
        NSLayoutConstraint.activate([
            launchLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            launchLabel.centerYAnchor.constraint(equalTo: view.centerYAnchor, constant: 100),
            launchLabel.widthAnchor.constraint(greaterThanOrEqualToConstant: 92.33),
            launchLabel.heightAnchor.constraint(equalToConstant: 24)
        ])
        
        NSLayoutConstraint.activate([
            launchLabelAdditional.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            launchLabelAdditional.centerYAnchor.constraint(equalTo: view.centerYAnchor, constant: 135),
            launchLabelAdditional.leadingAnchor.constraint(greaterThanOrEqualTo: view.leadingAnchor, constant: 20),
            launchLabelAdditional.trailingAnchor.constraint(lessThanOrEqualTo: view.trailingAnchor, constant: -20),
            launchLabelAdditional.heightAnchor.constraint(equalToConstant: 30)
        ])

        launchLabelAdditional.setContentHuggingPriority(.required, for: .horizontal)
        launchLabelAdditional.setContentCompressionResistancePriority(.required, for: .horizontal)


    }
}
