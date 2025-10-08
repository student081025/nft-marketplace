import qrcode
import json

#example of data in qr code
data = {
    "gymid": 1,
    "location": "Sportick_Lubyanka"
}

json_string = json.dumps(data)

qr = qrcode.QRCode(
    version=1,  
    error_correction=qrcode.constants.ERROR_CORRECT_L, 
    box_size=10,  
    border=4,  
)
qr.add_data(json_string)
qr.make(fit=True)

img = qr.make_image()

img.save("qrcode_lubyanka.png")