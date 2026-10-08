const navigationLinks = [...document.querySelectorAll('.navigation a[href^="#"]')];
const observedSections = navigationLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter((section) => section !== null);

if ("IntersectionObserver" in window) {
    const sectionVisibility = new Map();
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                sectionVisibility.set(
                    entry.target,
                    entry.isIntersecting ? entry.intersectionRatio : 0,
                );
            });

            const visibleSections = [...sectionVisibility.entries()]
                .filter(([, ratio]) => ratio > 0)
                .sort((first, second) => second[1] - first[1]);

            if (visibleSections.length === 0) {
                return;
            }

            const currentSectionId = visibleSections[0][0].id;

            navigationLinks.forEach((link) => {
                if (link.getAttribute("href") === `#${currentSectionId}`) {
                    link.setAttribute("aria-current", "location");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        },
        { threshold: [0.25, 0.5, 0.75] },
    );

    observedSections.forEach((section) => sectionObserver.observe(section));
}
