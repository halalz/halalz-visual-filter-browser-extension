const isInViewport = function (elem) {
  const bounding = elem.getBoundingClientRect();
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth) &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight)
  );
};
const isBase64Img = (imgSrc) => {
  return imgSrc.startsWith("data:image/");
};

const replaceImages = () => {
  const getAllImgs = document.querySelectorAll("img:not(.loading)") || [];
  for (const img of getAllImgs) {
    const imgUrl = img.src;

    if (isBase64Img(imgUrl) || !img.src) {
      continue;
    }

    if (isInViewport(img)) {
      img.classList.add("loading");
      chrome.runtime.sendMessage(
        {
          type: "processImage",
          imgUrl,
          isBase64Img: isBase64Img(imgUrl),
        },
        (response) => {
          img.src = response;
          img.classList.remove("loading");
        }
      );
    }
  }
};

replaceImages();

document.addEventListener("scroll", replaceImages);
