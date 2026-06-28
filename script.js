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

const formButton = document.querySelector(".lead-form button");

if (formButton) {
  formButton.addEventListener("click", () => {
    formButton.textContent = "Cảm ơn, chúng tôi sẽ liên hệ sớm";
    formButton.disabled = true;
    formButton.style.opacity = "0.88";
  });
}
