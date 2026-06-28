const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealElements.forEach((element) => observer.observe(element));

const heroCard = document.querySelector(".premium-card");

if (heroCard) {
  const rotateCard = (event) => {
    const rect = heroCard.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = (0.5 - y / rect.height) * 10;

    heroCard.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  };

  const resetCard = () => {
    heroCard.style.transform = "";
  };

  heroCard.addEventListener("mousemove", rotateCard);
  heroCard.addEventListener("mouseleave", resetCard);
}

const leadForm = document.querySelector(".lead-form");

if (leadForm) {
  const submitButton = leadForm.querySelector("button");
  const statusElement = leadForm.querySelector(".form-status");
  const defaultButtonText = submitButton.textContent;

  const setStatus = (message, type = "") => {
    statusElement.textContent = message;
    statusElement.classList.remove("is-error", "is-success");

    if (type) {
      statusElement.classList.add(type);
    }
  };

  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const endpoint = leadForm.dataset.endpoint;

    if (!endpoint || endpoint === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
      setStatus(
        "Bạn chưa cấu hình Google Apps Script URL. Hãy thay `data-endpoint` trong form bằng URL Web App đã deploy.",
        "is-error"
      );
      return;
    }

    const formData = new FormData(leadForm);
    const payload = {
      fullName: formData.get("fullName")?.toString().trim() || "",
      phone: formData.get("phone")?.toString().trim() || "",
      email: formData.get("email")?.toString().trim() || "",
      interest: formData.get("interest")?.toString().trim() || "",
      note: formData.get("note")?.toString().trim() || "",
      pageUrl: window.location.href,
      submittedAt: new Date().toISOString(),
    };

    submitButton.disabled = true;
    submitButton.textContent = "Đang gửi...";
    submitButton.style.opacity = "0.88";
    setStatus("Đang gửi thông tin, vui lòng chờ...");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.result !== "success") {
        throw new Error(result.message || "Không thể gửi dữ liệu.");
      }

      setStatus("Gửi thành công. Đội ngũ tư vấn sẽ liên hệ với bạn sớm.", "is-success");
      leadForm.reset();
    } catch (error) {
      setStatus(
        error.message || "Có lỗi xảy ra khi gửi dữ liệu. Vui lòng thử lại.",
        "is-error"
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = defaultButtonText;
      submitButton.style.opacity = "1";
    }
  });
}
