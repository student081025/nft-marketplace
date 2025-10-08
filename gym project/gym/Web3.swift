import Web3
import metamask_ios_sdk
import Foundation
import Web3ContractABI
import Web3PromiseKit
import BigInt


class Connect {
    static let connection = Connect()
    let web3 = Web3(rpcURL: "https://sepolia.infura.io/v3/your_infura_key")
    
    let contractAddressStr: String
    let contractAddress: EthereumAddress


    let tag = EthereumQuantityTag(tagType: .latest)
    var metamaskSDK: MetaMaskSDK
    
    private init() {
        contractAddressStr = "0x1e90e9a7d04832E5E6e3002f6E459f9137E4e438"
        contractAddress = try! EthereumAddress(hex: contractAddressStr, eip55: true)
        let appMetadata = AppMetadata(
            name: "NFT Marketplace",
            url: "https://nftmarketplace.com"
            
        )
        
        metamaskSDK = MetaMaskSDK.shared(
            appMetadata,
            transport: .deeplinking(dappScheme: "NFTMarketplace"),
            sdkOptions: SDKOptions(
                infuraAPIKey: "your_infura_key",
                readonlyRPCMap: [
                    "0xaa36a7": "https://sepolia.infura.io/v3/your_infura_key"
                ]
            )
        )
    }
    
    let jsonString = """
        [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"uint256","name":"ID","type":"uint256"},{"internalType":"address","name":"NFTContract","type":"address"}],"name":"addNFTContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"ID","type":"uint256"}],"name":"deleteNFTContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"gymID","type":"uint256"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"date","type":"uint256"}],"name":"getDuration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"ID","type":"uint256"}],"name":"getNFTContract","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"gymID","type":"uint256"},{"internalType":"address","name":"wallet","type":"address"}],"name":"hasNFTToGym","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"gymID","type":"uint256"},{"internalType":"uint256","name":"status","type":"uint256"},{"internalType":"string","name":"tariff","type":"string"},{"internalType":"uint256","name":"date","type":"uint256"},{"internalType":"uint256","name":"visits","type":"uint256"}],"name":"pauseMembership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"gymID","type":"uint256"}],"name":"returnURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"gymID","type":"uint256"},{"internalType":"uint256","name":"status","type":"uint256"},{"internalType":"string","name":"tariff","type":"string"},{"internalType":"uint256","name":"date","type":"uint256"},{"internalType":"uint256","name":"visits","type":"uint256"}],"name":"unpauseMembership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"gymID","type":"uint256"},{"internalType":"uint256","name":"status","type":"uint256"},{"internalType":"string","name":"tariff","type":"string"},{"internalType":"uint256","name":"date","type":"uint256"},{"internalType":"uint256","name":"visits","type":"uint256"}],"name":"writeOffVisit","outputs":[],"stateMutability":"nonpayable","type":"function"}]
        """.data(using: .utf8)!

    lazy var contract: DynamicContract = {
        let contract = try! web3.eth.Contract(json: jsonString, abiKey: nil, address: contractAddress)
        return contract
    }()

    func callFun(input: String, contract: DynamicContract) -> ((ABIEncodable...) -> SolidityInvocation)? {
        return contract[input]
    
    }


    func hasNFTToGym(_ gymID: BigUInt, _ address: EthereumAddress) -> [BigUInt]? {
        do {
            let call = try callFun(input: "hasNFTToGym", contract: contract)!(gymID, address).call().wait()
            let tokensIdsOwner: [BigUInt] = call[""]! as! [BigUInt]
            return tokensIdsOwner
        } catch {
            print("Error connected to 'hasNFTToGym': \(error)")
            return nil
        }
    }

    func returnURI(_ gymID: BigUInt, _ address: EthereumAddress, _ NFTID: BigUInt, tokens: [BigUInt]) -> Metadata? {
        let call = try! callFun(input: "returnURI", contract: contract)!(tokens[Int(NFTID)], gymID).call().wait()

        do {
            var decoded = try JSONDecoder().decode(Metadata.self, from: ConvertBase64(call[""] as! String).data(using: .utf8)!)
            decoded.image = ConvertBase64(decoded.image)
            return decoded
        } catch {
            print(error)
            return nil
        }
    }
    
    func connectToMetamask() async{
        let result = await metamaskSDK.connect()
        
        switch result {
        case .success(let account):
            if !account.isEmpty {
                UserDefaults.standard.set(account, forKey: "walletAddress")
            }
        case .failure(_):
            print("Failed to connect")
        }
    }
    
    
    func pauseMembership(
        gymID: BigUInt, NFTID: BigUInt, status: BigUInt, tariff: String, date: BigUInt, visits: BigUInt) async throws -> String {

        
        var call: any SolidityInvocation
        if status == 1 {
            call = callFun(input: "pauseMembership", contract: contract)!(NFTID, gymID, status, tariff, date, visits)
        }
        else{
            call = callFun(input: "unpauseMembership", contract: contract)!(NFTID, gymID, status, tariff, date, visits)
        }
        
        
        return try await sendingTransaction(call: call)
    }

    

    func writeOffVisit(gymID: BigUInt, NFTID: BigUInt, status: BigUInt, tariff: String, date: BigUInt,visits: BigUInt) async throws -> String{


        let call = callFun(input: "writeOffVisit", contract: contract)!(NFTID, gymID, status, tariff, date, visits)
        
        return try await sendingTransaction(call: call)

    }
    
    func sendingTransaction(call: any SolidityInvocation) async throws -> String{
        guard let rawData = call.encodeABI()?.hex() else {
            throw InvocationError.encodingError
        }
        
        let tx = Transaction(to: contractAddressStr, from: metamaskSDK.account, value: "0x0", data: rawData)

        let request: EthereumRequest<[Transaction]> = .init(id: TimestampGenerator.timestamp(), method: .ethSendTransaction, params: [tx])

        let sdkResult = await metamaskSDK.request(request)
        let txHash    = try sdkResult.get()
        return txHash
    }
    

    func ConvertBase64(_ strBase64: String) -> String {
        let range = strBase64.range(of: "base64,")
        let output = String(strBase64[range!.upperBound...])
        let data = Data(base64Encoded: output)!
        let str = String(data: data, encoding: .utf8)!
        return str
    }
}

struct Metadata: Decodable {
    var id: String
    var gym: String
    var status: String
    var tariff: String
    var visits: String
    var date: String
    var description: String
    var image: String
}


struct Transaction: metamask_ios_sdk.CodableData {
    let to: String
    let from: String
    let value: String
    let data: String?

    init(to: String, from: String, value: String, data: String? = nil) {
        self.to = to
        self.from = from
        self.value = value
        self.data = data
    }
}


