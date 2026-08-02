document.addEventListener("DOMContentLoaded", function () {
  const profilePicInput = document.getElementById("profile-pic-input");
  const profilePicPreview = document.getElementById("profile-pic-preview");

  profilePicInput.addEventListener("change", (event) => {
    const fileInput = event.target;
    if (fileInput) {
      const file = fileInput.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          profilePicPreview.src = e.target?.result;
        };
        reader.readAsDataURL(file);
      }
    }
  });
});
