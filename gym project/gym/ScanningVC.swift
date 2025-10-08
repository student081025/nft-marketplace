import UIKit
import Web3
import AVFoundation
import BigInt

class ScanningVC: UIViewController, AVCaptureMetadataOutputObjectsDelegate {
    
    var captureSession = AVCaptureSession()
    var videoPreviewLayer: AVCaptureVideoPreviewLayer?
    var qrCodeFrameView: UIView?
    var scanningAllow = true
    var warningLabel = UILabel()


    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        guard let captureDevice = AVCaptureDevice.default(for: .video) else {
            print("Failed to get the camera device")
            return
        }
        
        do {
            captureSession.addInput(try AVCaptureDeviceInput(device: captureDevice))
            
            let captureMetadataOutput = AVCaptureMetadataOutput()
            captureSession.addOutput(captureMetadataOutput)
            captureMetadataOutput.setMetadataObjectsDelegate(self, queue: .main)
            captureMetadataOutput.metadataObjectTypes = [.qr]
            
            videoPreviewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
            videoPreviewLayer?.videoGravity = .resizeAspectFill
            videoPreviewLayer?.frame = view.layer.bounds
            
            if let videoPreviewLayer = videoPreviewLayer {
                view.layer.addSublayer(videoPreviewLayer)
            }
            
            captureSession.startRunning()
            
        } catch {
            print("Error setting up capture session: \(error)")
        }
    }
    
    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        hidesBottomBarWhenPushed = true
        
        guard let connection = videoPreviewLayer?.connection
        else {
            return
        }
        let previewOrientation: AVCaptureVideoOrientation = .portrait
        
        connection.videoOrientation = previewOrientation
        videoPreviewLayer?.frame = view.bounds
    }
    
    func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
        
        guard scanningAllow else { return }
        
        guard let metadataObject = metadataObjects.first as? AVMetadataMachineReadableCodeObject,
              [.qr].contains(metadataObject.type) else {
            qrCodeFrameView?.frame = .zero
            return
        }
        
        if let barCodeObject = videoPreviewLayer?.transformedMetadataObject(for: metadataObject) {
            qrCodeFrameView?.frame = barCodeObject.bounds
        }
        
        if let stringValue = metadataObject.stringValue {
            scanningAllow = false
            launchApp(decodedURL: stringValue)
        }
    }
    
    func loading(){
        let circle = UIActivityIndicatorView(style: .large)
        circle.color = UIColor.white
        circle.translatesAutoresizingMaskIntoConstraints = false
        
        let square = UIView()
        square.layer.cornerRadius = 10
        square.backgroundColor = .black.withAlphaComponent(0.8)
        square.translatesAutoresizingMaskIntoConstraints = false
        
        self.view.addSubview(square)
        square.addSubview(circle)
        circle.startAnimating()
        
        NSLayoutConstraint.activate([
            circle.centerXAnchor.constraint(equalTo: square.centerXAnchor),
            circle.centerYAnchor.constraint(equalTo: square.centerYAnchor),
            
            square.centerXAnchor.constraint(equalTo: self.view.centerXAnchor),
            square.centerYAnchor.constraint(equalTo: self.view.topAnchor, constant: self.view.bounds.height * 0.5),
            square.widthAnchor.constraint(equalTo: self.view.widthAnchor, multiplier: 0.15),
            square.heightAnchor.constraint(equalTo: self.view.widthAnchor, multiplier: 0.15),
        ])
        
        self.view.layoutIfNeeded()
    }
    
    private func stopLoading() {
        for subview in self.view.subviews {
            if subview.backgroundColor == .black.withAlphaComponent(0.8) {
                subview.removeFromSuperview()
            }
        }
    }
    
    
    
    private func launchApp(decodedURL: String) {
        guard presentedViewController == nil else { return }

        do {
            let gymData = try JSONDecoder().decode(Gym.self, from: decodedURL.data(using: .utf8)!)

            DispatchQueue.main.async {
                self.loading()
            }
            


            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                let nftVC = showNFTVC()
                let addr = Connect.connection.metamaskSDK.account
                nftVC.id = BigUInt(gymData.gymid)
                nftVC.location = gymData.location
                print(gymData.location)
                let tokens = Connect.connection.hasNFTToGym(BigUInt(exactly: gymData.gymid)!, try! EthereumAddress(hex: addr, eip55: true))
                
                if tokens?.count != 0 && tokens?.count != nil{
                    self.scanningAllow = false
                    self.warningLabel.text = "Access granted!"
                    self.warningLabel.textColor = .green
                    self.estWarning()
                    nftVC.tokens = tokens
                    
                    nftVC.cameFromScanningVC = true
                    
                    self.navigationController?.pushViewController(nftVC, animated: true)
                }
                else{
                    self.stopLoading()
                    self.warningLabel.text = "You do not possess NFT of this organization"
                    self.warningLabel.textColor = .red
                    self.estWarning()
                    self.scanningAllow = true
                }
            }
        } catch {
            print("Error decoding JSON: \(error)")
        }
    }
    
    func estWarning(){
        warningLabel.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(warningLabel)
        NSLayoutConstraint.activate([
            warningLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            warningLabel.centerYAnchor.constraint(equalTo: view.topAnchor, constant: view.bounds.height * 0.75),
            warningLabel.widthAnchor.constraint(equalTo: self.view.widthAnchor, multiplier: 0.85),
            warningLabel.heightAnchor.constraint(equalTo: self.view.widthAnchor, multiplier: 0.2),
        ])
    }

}

struct Gym: Decodable {
    
    let gymid: Int
    let location: String
}



