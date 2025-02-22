//监听当前网页的所有的input框
// 监听所有 input 框
export {};
var username: string | undefined = '';
var password: string | undefined= '';
let usernameInput: HTMLInputElement | null  = null;
let passwordInput: HTMLInputElement | null  = null;
let port : chrome.runtime.Port|null = null;
let passwordList : Array<PasswordObject> | null = [];

export const MK_KEY = 'MK';

declare global {
    interface HTMLElement {
        hasListener?: boolean;
    }
}
type PasswordObject = {
    id: string,
    iv: string,
    pw: string,
    username: string,
    salt: string,
    website: string
  }
function setValue(element :HTMLInputElement, value:string) {
    element.value = value;
    element.dispatchEvent(new Event("input")); // 触发input事件
    element.dispatchEvent(new Event("change")); // 触发change事件
}
export const getStorage = (key: string): Promise<any> => {
    return new Promise(resolve => {
      chrome.storage.local.get([key], result => resolve(result[key]));
    });
  };
// content script
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.type === 'GET_PAGE_ORIGIN') {
      console.log("ORIGIN", window.location.origin);
      sendResponse({origin: window.location.origin});
      return true; // 保持通道开放
    }
    return false;
});

const readyInputPassword = () => {
    
    // 添加防重复触发机制

    if(passwordList && passwordList.length > 0){
        showCustomConfirm("是否自动填充账户和密码？", (confirmed: boolean) => {
            if(confirmed){
                let password = passwordList![passwordList!.length-1];
                console.log("readyInputPassword ", password)
                if (usernameInput) {
                    setValue(usernameInput, password.username);
                }
                if(passwordInput) {
                    setValue(passwordInput, password.pw);
                }
            }
        });
    }
}

const onMessage = (msg : {id: string, method: string, code: number, args: string| Array<PasswordObject> |null}) => {
    console.log('msg', msg);
    if('save_password_response' === msg.method){
        if(0 === msg.code){
            showAutoCloseToast("保存成功,digest:"+msg.args, 5000); // 替换原来的alert
        }else {
            showAutoCloseToast("保存失败,请稍后重试", 4000); // 替换原来的alert
        }
    }else if("getPasswordObjectDataRes" === msg.method){
        if(msg.code == 0){
            passwordList = msg.args as Array<PasswordObject>;
        }else{
            port?.postMessage({method: 'getPasswordObjectData' , args: {pageOrigin:window.location.origin}});
        }
    }
}
const onSubmit = async (_e: Event) => {
    let url = window.location.origin;
    let usernameNew = usernameInput?.value;
    let passwordNew = passwordInput?.value;
    console.log("usernameNew:"+usernameNew+", passwordNew:"+passwordNew);
    if (usernameNew != username || passwordNew != password) {
        username = usernameNew;
        password = passwordNew;
        
        // 显示自定义确认框
        if(password != ''){
            showCustomConfirm("是否保存该密码？", async (confirmed: boolean) => {
                if (confirmed) {
                    
                    let mk = await getStorage(MK_KEY);
                    //判断 mk是否为空
                    // 新增密钥检查逻辑
                    if (!mk) {
                        alert("尚未设置加密密钥，请先设置！");
                        return;
                    }
                    port?.postMessage({
                        method: 'save_password',
                        args: {
                            username: usernameNew,
                            password: passwordNew,
                            url: url
                        }
                    });
                }
            });
        }
    }
}

// 新增自定义确认框函数
function showCustomConfirm(message : string, callback: (confirmed: boolean) => void) {
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;

    // 创建确认框容器
    const confirmBox = document.createElement('div');
    confirmBox.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        text-align: center;
    `;

    // 创建消息内容
    const messageEl = document.createElement('p');
    messageEl.textContent = message;
    messageEl.style.marginBottom = '20px';

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    
    // 创建确认按钮
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '确认';
    confirmBtn.style.cssText = `
        padding: 8px 20px;
        margin: 0 10px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    `;

    // 创建取消按钮
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.cssText = `
        padding: 8px 20px;
        margin: 0 10px;
        background: #f44336;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    `;

    // 添加事件处理
    confirmBtn.onclick = () => {
        document.body.removeChild(overlay);
        callback(true);
    };
    cancelBtn.onclick = () => {
        document.body.removeChild(overlay);
        callback(false);
    };

    // 组装元素
    buttonContainer.appendChild(confirmBtn);
    buttonContainer.appendChild(cancelBtn);
    confirmBox.appendChild(messageEl);
    confirmBox.appendChild(buttonContainer);
    overlay.appendChild(confirmBox);
    document.body.appendChild(overlay);
}

// 新增自动关闭提示函数
function showAutoCloseToast(message: string, duration: number) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        right: 20px;
        top: 20px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 16px 32px;
        border-radius: 8px;
        font-size: 18px;
        font-weight: bold;
        transition: opacity 0.3s;
        opacity: 0;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(toast);
    
    // 触发渐入动画
    setTimeout(() => toast.style.opacity = '1', 10);
    
    // 自动关闭（将duration参数改为3000000实现3000秒，但建议使用3000表示3秒）
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function listenToInputs() {
    // 获取页面上所有的 input 元素
    const inputs = document.getElementsByTagName('input');
    if (inputs.length === 0) {
        console.log('没有找到 input 元素');
        const frames = document.querySelectorAll('iframe');
        //获取iframe中的input元素
        frames.forEach(frame => {
            try {
                // 确保同源策略允许访问
                const frameDoc = frame.contentDocument || frame.contentWindow?.document;
                if (frameDoc) {
                    processInputs(frameDoc);
                }
            } catch (e) {
                console.warn('无法访问iframe文档:', e);
            }
        });
    }
    //处理主文档的input
    processInputs(document);
}

function processInputs(rootDocument: Document) {
    const inputs = rootDocument.querySelectorAll('input');
    //const submitButtons = rootDocument.querySelectorAll('button, input[type="submit"], input[type="button"]');

    // 遍历所有 input 元素
    for (let input of inputs) {
        // 判断是否是用户名输入框
        if (isUsernameField(input)) {
            console.log('找到用户名输入框:', input);
            usernameInput = input;
            // 监听输入事件

            if (!input.hasListener) {
                input.addEventListener('input', (e) => {
                    console.log('用户名输入:', (e.target as HTMLInputElement).value);
                });
                input.hasListener = true; // 添加标记
            }
        }

        // 判断是否是密码输入框
        if (isPasswordField(input)) {
            console.log('找到密码输入框:', input);
            passwordInput = input;
            
            // 新增防重复绑定检查
            if (!input.hasListener) {
                input.addEventListener('input', (e) => {
                    console.log('密码输入:', (e.target as HTMLInputElement).value);
                });
                
                input.addEventListener('focus', (_e) => {
                    readyInputPassword();
                });
                
                input.hasListener = true; // 添加标记
            }

            const buttons = Array.from(input.form?.elements || document.querySelectorAll('button, input[type="submit"]'));
            let closestButton: HTMLElement | null = null;
            let minDistance = Infinity;
            console.log(buttons);
            buttons.forEach(btn => {
                if (isSubmitButton(btn as HTMLElement)) {
                    const btnRect = btn.getBoundingClientRect();
                    const inputRect = input.getBoundingClientRect();
                    // 计算垂直方向距离
                    const distance = Math.abs(btnRect.top - inputRect.bottom);
                    
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestButton = btn as HTMLElement;
                    }
                }
            });
        
            if (closestButton && !(closestButton as HTMLElement).hasListener){
                (closestButton as HTMLElement).addEventListener('click', onSubmit);
                (closestButton as HTMLElement).hasListener = true;
            }
        }
    }
}
// 新增判断提交按钮的方法
function isSubmitButton(element: HTMLElement) {
    const buttonIdentifiers = ['submit', 'confirm', 'login', 'signin'];
    const buttonTexts = ['登录', 'login', '确定', 'confirm', 'submit'];
    const elementId = element.id.toLowerCase();
    const elementType = (element as HTMLInputElement | HTMLButtonElement).type?.toLowerCase() || '';
    const buttonText = element.textContent?.toLowerCase() || '';
    let isLoginText = buttonTexts.some(text => buttonText.includes(text));
    return (elementType === 'submit' && isLoginText) ||
        ( elementType === 'button' && (buttonIdentifiers.some(id => elementId.includes(id)) ||
        isLoginText));
}
// 判断是否是用户名输入框
function isUsernameField(input: HTMLInputElement) {
    const usernameIdentifiers = ['username', 'user', 'email', 'account', 'login','手机','邮箱','用户名'];
    const inputType = input.type.toLowerCase();
    const placeholder = input.placeholder.toLowerCase();
    const inputId = input.id.toLowerCase();
    const inputName = input.name.toLowerCase();

    return (
        (inputType === 'text' || inputType === 'email') &&
        (usernameIdentifiers.some(id => inputId.includes(id)) ||
            usernameIdentifiers.some(id => inputName.includes(id) ||
            usernameIdentifiers.some(id => placeholder.includes(id))
        ))
    );
}

// 判断是否是密码输入框
function isPasswordField(input: HTMLInputElement) {
    return input.type.toLowerCase() === 'password';
}

port = chrome.runtime.connect({ name: "server-worker" });
console.log("connect");
port.onMessage.addListener(onMessage);

port.postMessage({method: 'getPasswordObjectData' , args: {pageOrigin:window.location.origin}});
// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', listenToInputs);
// 创建 MutationObserver 实例
const observer = new MutationObserver(() => {
    // 当 DOM 发生变化时，调用 listenToInputs 函数
    listenToInputs();
});

// 配置 MutationObserver 的观察选项
const config = {
    childList: true, // 监听子节点的变化
    subtree: true,  // 监听子树的变化
    attributes: true, // 监听属性的变化
};

// 开始观察 document.body 的变化
observer.observe(document.body, config);


