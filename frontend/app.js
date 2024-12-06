const url = "/image";
const uploadFormDOM = document.querySelector("#uploadImgForm");
const resizeFormDOM = document.querySelector("#resizeImgForm");


const nameInputDOM = document.querySelector("#name");
const heightInputDOM = document.querySelector("#height");
const widthInputDOM = document.querySelector("#width");
const formatInputDOM = document.querySelector("#format");
const imageInputDOM = document.querySelector("#image");

const imagesGalleryDOM = document.querySelector("#imagesGallery");

const optionsToAccessImages = document.querySelector("#optionsToAccessImages");
const upload = document.querySelector("#upload");
const selectedImg = document.querySelector("#selectedImg");
uploadFormDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
 
  try {
    const imageFile = imageInputDOM.files[0];
    const fileFormat = imageFile.type.split("/")[1];
    if (fileFormat != "png" && fileFormat != "jpg" && fileFormat != "jpeg"&& fileFormat != "gif") {
      throw new Error("Invalid file format");
    }
    const formData = new FormData();
    formData.append("file", imageFile);
    const msg = await axios.post(`${url}/upload/${nameInputDOM.value}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res) => res.data.data.msg);
    alert(msg);
    fetchImages();
    uploadFormDOM.classList.add("hidden");
  } catch (error) {
    console.log(error);
    alert(error);
  }
});
upload.addEventListener("click", () => {
  uploadFormDOM.classList.remove("hidden");
  optionsToAccessImages.classList.add("hidden");
  resizeFormDOM.classList.add("hidden");
});
async function fetchImages() {
  try {
    let images = await axios.get(`${url}s`).then((res) =>  res.data.data);
    console.log(images);
    const imagesDOM = images
      .map((image) => {
        return `
        <div>
            <img class="galleryImage" src="${url+image.src}" alt="${image.fileName}" data-format="${image.format}" />
        </div>
        `;
      })
      .join("");
      imagesGalleryDOM.innerHTML = imagesDOM;
  } catch (error) {
    console.log(error);
    alert(error);
  }
}

imagesGalleryDOM.addEventListener("click", (e) => {
  if (e.target.classList.contains("galleryImage")) {
    let image = e.target;
    heightInputDOM.value = image.height;
    widthInputDOM.value = image.width;
    formatInputDOM.value = image.dataset.format;
    selectedImg.src = image.src;
    selectedImg.alt = image.alt;
    resizeFormDOM.classList.remove("hidden");
    optionsToAccessImages.classList.add("hidden");
    uploadFormDOM.classList.add("hidden");
  }
});
heightInputDOM.addEventListener("change", (e) => {
  if(e.target.value>=1){
    selectedImg.height = e.target.value;
  }
});
widthInputDOM.addEventListener("change", (e) => {
  if(e.target.value>=1){
    selectedImg.width = e.target.value;
  }
});
resizeFormDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  try {
    const height = heightInputDOM.value;
  const width = widthInputDOM.value;
  const format = formatInputDOM.value;
  if(format != "png" && format != "jpg" && format != "jpeg"&& format != "gif"){
    throw new Error("Please enter valid image extention from ['png','jpg','jpeg','gif']")
  }
  const formData = {
    image: selectedImg.src
  }
    const src = await axios.post(`${url}/resize/${selectedImg.alt}/${width}/${height}/${format}`, formData).then((res) => res.data.data.image).catch((err)=>{throw new Error("Please enter correct parameters")} )
    if(!src){
      throw new Error("Please enter correct parameters")
    }
    document.querySelector("#linkText").value = `${url+src}`;
    document.querySelector("#downloadLink").href = `${url+src}`;
    document.querySelector("#downloadLink").download = `${selectedImg.alt}.${width}.${height}`;
    resizeFormDOM.classList.add("hidden");
    optionsToAccessImages.classList.remove("hidden");

  } catch (error) {
    console.log(error);
    alert(error);
  }
});

function copyLink() {
    // Get the text field
    let copyLink = document.getElementById("linkText");
  
    // Select the text field
    copyLink.select();
    copyLink.setSelectionRange(0, 99999); // For mobile devices
  
     // Copy the text inside the text field
    navigator.clipboard.writeText(copyLink.value);
  
  }
fetchImages();
