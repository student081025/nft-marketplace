import UIKit
import metamask_ios_sdk
import Network

class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?
    
    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        guard let url = URLContexts.first?.url else { return }

        if URLComponents(url: url, resolvingAgainstBaseURL: true)?.host == "mmsdk" {
            MetaMaskSDK.sharedInstance?.handleUrl(url)
        }
    }

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
            guard let windowScene = (scene as? UIWindowScene) else { return }
            
            window = UIWindow(frame: windowScene.coordinateSpace.bounds)
            
            window?.windowScene = windowScene
            window?.rootViewController = LaunchScreenAnimation()

            window?.makeKeyAndVisible()
            
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                self.setUp()
            }
        }
    
    
    func setUp(){
        
        if UserDefaults.standard.bool(forKey: "loggedIn") {
            let monitor = NWPathMonitor()
            let queue = DispatchQueue.global(qos: .background)
            monitor.pathUpdateHandler = { path in
                        DispatchQueue.main.async {  
                            if path.status == .satisfied {
                                self.window?.rootViewController = self.createTabBar()
                            } else {
                                self.window?.rootViewController = NoInternetVC()
                            }
                        }
            }
            monitor.start(queue: queue)

        }
        else {
            window?.rootViewController = UINavigationController(rootViewController: LogVC())
            if UserDefaults.standard.bool(forKey: "firstLog"){
                window?.rootViewController = UINavigationController(rootViewController: IntroVC())
            }
        }
    }
    
    func createTabBar() -> UITabBarController {
            let tabBar = UITabBarController()
            UITabBar.appearance().tintColor = .black

            let hvc = HomeVC()
            hvc.tabBarItem = UITabBarItem(title: "Home", image: UIImage(systemName: "house"), tag: 0)
            let hvcNavi = UINavigationController(rootViewController: hvc)

            let svc = SettingsVC()
            svc.tabBarItem = UITabBarItem(title: "Settings", image: UIImage(systemName: "gear"), tag: 1)

            tabBar.viewControllers = [hvcNavi, svc]
            return tabBar
        }

    func sceneDidDisconnect(_ scene: UIScene) {
        // Called as the scene is being released by the system.
        // This occurs shortly after the scene enters the background, or when its session is discarded.
        // Release any resources associated with this scene that can be re-created the next time the scene connects.
        // The scene may re-connect later, as its session was not necessarily discarded (see `application:didDiscardSceneSessions` instead).
    }

    func sceneDidBecomeActive(_ scene: UIScene) {
        // Called when the scene has moved from an inactive state to an active state.
        // Use this method to restart any tasks that were paused (or not yet started) when the scene was inactive.
    }

    func sceneWillResignActive(_ scene: UIScene) {
        // Called when the scene will move from an active state to an inactive state.
        // This may occur due to temporary interruptions (ex. an incoming phone call).
    }

    func sceneWillEnterForeground(_ scene: UIScene) {
        // Called as the scene transitions from the background to the foreground.
        // Use this method to undo the changes made on entering the background.
    }

    func sceneDidEnterBackground(_ scene: UIScene) {
        // Called as the scene transitions from the foreground to the background.
        // Use this method to save data, release shared resources, and store enough scene-specific state information
        // to restore the scene back to its current state.
    }


}

