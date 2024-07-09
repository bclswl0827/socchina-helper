const getUrlString = (s) => s.match(/(https?|http):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g);

const sleep = async (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
});

const uploadFile = () => {
    const file =
        document.getElementById("fileInput").files[0];
    if (!file) {
        alert("请选择文件");
        return;
    }
    const filename = file.name.toLowerCase();
    if (
        !filename.endsWith(".zip") &&
        !filename.endsWith(".rar") &&
        !filename.endsWith(".pdf") &&
        !filename.endsWith(".mp4") &&
        !filename.endsWith(".png") &&
        !filename.endsWith(".jpg")
    ) {
        alert("文件格式不支持");
        return;
    }

    const formData = new FormData(
        document.getElementById("uploadForm")
    );

    let uploadType = "uploadPDF";
    switch (filename.split(".")[1]) {
        case "zip":
        case "rar":
            uploadType = "uploadRAR";
            break;
        case "pdf":
            uploadType = "uploadPDF";
            break;
        case "mp4":
            uploadType = "uploadVideo";
            break;
        case "png":
        case "jpg":
            uploadType = "uploadPics";
            break;
    }

    const xhr = new XMLHttpRequest();
    xhr.timeout = 2 ** 53;
    xhr.open(
        "POST",
        `http://www.socchina.net/competitionProduction/${uploadType}`,
        true
    );
    xhr.setRequestHeader(
        "Accept-Language",
        "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2"
    );
    xhr.setRequestHeader(
        "Accept",
        "application/json, text/javascript, */*; q=0.01"
    );
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    const uploadStatus = document.getElementById("uploadStatus");
    xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
            const percentage = (event.loaded / event.total) * 100;
            uploadStatus.textContent = `上传进度 ${percentage.toFixed(
                2
            )}%`;
            uploadStatus.hidden = false;
        }
    };

    xhr.onload = () => {
        if (xhr.status === 200) {
            const assetUrl = getUrlString(xhr.responseText);
            uploadStatus.textContent = `资源链接 ${assetUrl.length ? assetUrl[0] : xhr.responseText}`;
        } else {
            uploadStatus.textContent = `上传失败 ${xhr.status} ${xhr.statusText} ${xhr.responseText}`;
        }
    };

    xhr.onerror = async (event) => {
        uploadStatus.textContent = `上传出错 ${JSON.stringify(event)}，即将重试`;
        await sleep(1000);
        return uploadFile();
    };

    xhr.send(formData);
};

const updateVideoUrl = () => {
    const url = document.getElementById("videoUrl").value;
    if (url.length) {
        uploadVideo = document.getElementById("videoUrl").value;
        $("#video").attr("style", "display:none");
        $("#video1").attr("style", "display:block");
        $("#showVideo").attr("href", uploadVideo + '?data=' + Date.parse(new Date()));
    }
};

const updateDocsUrl = () => {
    const url = document.getElementById("docsUrl").value;
    if (url.length) {
        uploadPDF = url;
        $("#pdf").attr("style", "display:none");
        $("#pdf1").attr("style", "display:block");
        $("#showPDF").attr("href", uploadPDF + '?data=' + Date.parse(new Date()));
    }
};

const updateCodeUrl = () => {
    const url = document.getElementById("codeUrl").value;
    if (url.length) {
        uploadRAR = url;
        $("#rar").attr("style", "display:none");
        $("#rar1").attr("style", "display:block");
        $("#showRAR").attr("href", uploadRAR + '?data=' + Date.parse(new Date()));
    }
};

const updateLicenseUrl = () => {
    const url = document.getElementById("licenseUrl").value;
    if (url.length) {
        uploaAuthdPDF = url;
        $("#pdf7").attr("style", "display:none");
        $("#pdf8").attr("style", "display:block");
        $("#showAuthPDF").attr("href", uploaAuthdPDF + '?data=' + Date.parse(new Date()));
    }
};

const updatePicsUrl = () => {
    const url = document.getElementById("picsUrl").value.split(";");
    if (url.length <= 4) {
        $("#demo2").html("");
        url.forEach((pic, index) => {
            if (pic.length) {
                let picHTML =
                    '<div style="display:inline-block;width:40%;;margin-right:0px; position: relative;margin-bottom:10px">';
                picHTML += '<img class="picsClass" id="pic' + index + '" style="width:100%;height:250px" src="' + pic +
                    '" alt="" class="layui-upload-img"/>';
                picHTML += '<img id="del' + index + '" onclick="fn.removePic(' + index +
                    ')" src="images/shanchu.png" alt="" style="cursor: pointer;width:20px;height:20px;    position: absolute;    right: -5px;top: -8px;"/>';
                picHTML += '</div>';
                $('#demo2').append(picHTML);
            }
        });

    }
};

const main = () => {
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.bottom = '20px';
    popup.style.right = '20px';
    popup.style.width = '400px';
    popup.style.height = '300px';
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    popup.style.color = 'white';
    popup.style.padding = '20px';
    popup.style.borderRadius = '10px';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    popup.style.zIndex = '9999';
    popup.style.overflowY = 'scroll';
    popup.style.overflowX = 'scroll';
    popup.innerHTML = `<div id="helperApp">
    <span id="uploadStatus">文件上传助手 - 当前无任务</span>

    <form id="uploadForm" enctype="multipart/form-data">
        <div style="display: flex; flex-direction: row; margin-top: 20px">
            <input id="fileInput" type="file" name="file" />
            <button
                type="button"
                onclick="uploadFile()"
                style="margin-left: 6px; width: 80px"
            >
                上传文件
            </button>
        </div>
    </form>

    <div style="flex-direction: column; gap: 10px; display: flex; margin-top: 12px">
        <div>
            <span style="margin-right: 2px">演示影片 URL</span>
            <input id="videoUrl" type="text" style="width: 140px; border: 1px solid white; radius: 5px; color: white; padding: 2px" />
            <button
                type="button"
                onclick="updateVideoUrl()"
                style="margin-left: 6px; padding: 2px; width: 40px"
            >
                设置
            </button>
        </div>
        <div>
            <span style="margin-right: 2px">技术文档 URL</span>
            <input id="docsUrl" type="text" style="width: 140px; border: 1px solid white; radius: 5px; color: white; padding: 2px" />
            <button
                type="button"
                onclick="updateDocsUrl()"
                style="margin-left: 6px; padding: 2px; width: 40px"
            >
                设置
            </button>
        </div>
        <div>
            <span style="margin-right: 2px">重点代码 URL</span>
            <input id="codeUrl" type="text" style="width: 140px; border: 1px solid white; radius: 5px; color: white; padding: 2px" />
            <button
                type="button"
                onclick="updateCodeUrl()"
                style="margin-left: 6px; padding: 2px; width: 40px"
            >
                设置
            </button>
        </div>
        <div>
            <span style="margin-right: 20px">授权书 URL</span>
            <input id="licenseUrl" type="text" style="width: 140px; border: 1px solid white; radius: 5px; color: white; padding: 2px" />
            <button
                type="button"
                onclick="updateLicenseUrl()"
                style="margin-left: 6px; padding: 2px; width: 40px"
            >
                设置
            </button>
        </div>
        <div>
            <span style="margin-right: 20px">预览图 URL</span>
            <input id="picsUrl" type="text" style="width: 140px; border: 1px solid white; radius: 5px; color: white; padding: 2px" placeholder="多张以分号分隔" />
            <button
                type="button"
                onclick="updatePicsUrl()"
                style="margin-left: 6px; padding: 2px; width: 40px"
            >
                设置
            </button>
        </div>
    </div>
</div>`;
    document.body.appendChild(popup);
};

main();
