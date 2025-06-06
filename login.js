imgIndex = 1;
changing = false;

const url = 'https://sams-backend-u79d.onrender.com/index.php';

//pop up///////////////////////////////////////////////////////////////
async function ClosePopup() {
    var popup = document.getElementById("popup");
    popup.className = "popup hide";
}
async function OpenPopup() {
    var popup = document.getElementById("popup");
    popup.className = "popup show";
    console.log(popup);
}

//gallery///////////////////////////////////////////////////////////////
async function PrevImg() {
    if (imgIndex <= 1) imgIndex = 3;
    else imgIndex -= 1;
    ChangeImg();
}

async function NextImg() {
    imgIndex = imgIndex % 3 + 1;
    ChangeImg();
}
function ChangeImg() {
    if (changing) return;
    changing = true;
    var img = document.getElementById("school"),
        newImg = new Image();
    newImg.id = "school";
    newImg.src = "assets/School" + imgIndex + ".jpg";
    img.parentNode.insertBefore(newImg, img.nextSibling);
    setTimeout(function() {
        img.parentNode.removeChild(img);
        changing = false;
    }, 1500);
}

async function LoopImg() {
    setTimeout(function() {
        imgIndex = imgIndex % 3 + 1;
        ChangeImg();
        LoopImg();
    }, 7000);
}

//sign in///////////////////////////////////////////////////////////////
function LogIn(e) {
    const errorElement = document.querySelector("#errorPrompt");

    //call api
    const soapBody = `
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
                <LogIn>
                    <Email>${document.querySelector("#username").value}</Email>
                    <Password>${document.querySelector("#password").value}</Password>
                </LogIn>
            </soap:Body>
        </soap:Envelope>
    `;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            'SOAPAction': 'LogIn'
        },
        body: soapBody
    })
    .then((res) => res.text())
    .then((txt) => {
        // Parse the XML response
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(txt, "text/xml");

        // Check for SOAP Fault
        const fault = xmlDoc.getElementsByTagName("SOAP-ENV:Fault")[0];
        if (fault) {
            // Extract faultstring or details
            const faultString = fault.getElementsByTagName("faultstring")[0]?.textContent;
            console.error("SOAP Fault:", faultString);
            errorElement.innerHTML = faultString;

            e.preventDefault();
            return null;
        }
        console.log(txt);
        const res = {};
        const keys = xmlDoc.getElementsByTagName("key");
        const values = xmlDoc.getElementsByTagName("value");
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i].textContent;
            const value = values[i].textContent;
            if (key) res[key] = value;
        }
        window.location.href = `Users/${res["type"]}/viewReport.html?token=${res["token"]}`;
    });
}
document.querySelector('#loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('iya~~ (*/ω＼*)'); //PLEASE PLEASE PLEASE REMOVE THIS PLEASEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
    LogIn(e);
});

LoopImg();