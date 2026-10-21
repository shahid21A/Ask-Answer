
(() => {
	const menuButton = document.querySelector(".menu-toggle");
	const mainNav = document.querySelector(".main-nav");
	const cards = [...document.querySelectorAll(".question-card[data-question]")];

	function readStoredValue(key, fallback) {
		try {
			const value = localStorage.getItem(key);
			return value === null ? fallback : JSON.parse(value);
		} catch {
			return fallback;
		}
	}

	function readMap(key) {
		const value = readStoredValue(key, {});
		return value && typeof value === "object" && !Array.isArray(value) ? value : {};
	}

	function readList(key) {
		const value = readStoredValue(key, []);
		return Array.isArray(value) ? value : [];
	}

	function appendComment(list, author, text) {
		const comment = document.createElement("article");
		const name = document.createElement("strong");
		const body = document.createElement("p");
		comment.className = "community-comment user-comment";
		name.textContent = author;
		body.textContent = text;
		comment.append(name, body);
		list.append(comment);
	}

	function syncQuestionCards() {
		const likes = readMap("qa-hub-home-question-likes");
		const saved = readList("qa-hub-home-saved-questions");
		const comments = readMap("qa-hub-home-question-comments");

		cards.forEach((card) => {
			const questionId = card.dataset.question;
			const likeButton = card.querySelector("[data-like-question]");
			const likeCount = card.querySelector("[data-like-count]");
			const baseLikeCount = Number(likeCount.dataset.baseCount || likeCount.textContent);
			const isLiked = Boolean(likes[questionId]);
			likeCount.dataset.baseCount = String(baseLikeCount);
			likeCount.textContent = String(baseLikeCount + Number(isLiked));
			likeButton.setAttribute("aria-pressed", String(isLiked));
			likeButton.classList.toggle("is-liked", isLiked);

			const saveButton = card.querySelector("[data-save-question]");
			const isSaved = saved.includes(questionId);
			saveButton.setAttribute("aria-pressed", String(isSaved));
			saveButton.classList.toggle("is-saved", isSaved);
			saveButton.setAttribute("aria-label", isSaved ? "Remove saved question" : "Save question");
			saveButton.querySelector("span").textContent = isSaved ? "Saved" : "Save";

			const commentList = card.querySelector("[data-comment-list]");
			const commentCount = card.querySelector("[data-comment-count]");
			commentList.querySelectorAll(".user-comment").forEach((comment) => comment.remove());
			const questionComments = Array.isArray(comments[questionId]) ? comments[questionId] : [];
			questionComments.forEach((text) => appendComment(commentList, "You", text));
			const baseCommentCount = Number(commentCount.dataset.baseCount || commentCount.textContent);
			commentCount.dataset.baseCount = String(baseCommentCount);
			commentCount.textContent = String(baseCommentCount + questionComments.length);
		});
	}

	function setMenuOpen(isOpen) {
		if (!menuButton || !mainNav) return;
		mainNav.classList.toggle("is-open", isOpen);
		menuButton.setAttribute("aria-expanded", String(isOpen));
		menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
	}

	menuButton?.addEventListener("click", () => {
		setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
	});

	mainNav?.addEventListener("click", (event) => {
		const link = event.target.closest(".nav-link");
		if (!link) return;
		mainNav.querySelectorAll(".nav-link").forEach((navLink) => navLink.classList.toggle("active", navLink === link));
		setMenuOpen(false);
	});

	document.addEventListener("keydown", (event) => {
		if (event.key !== "Escape" || !mainNav?.classList.contains("is-open")) return;
		setMenuOpen(false);
		menuButton.focus();
	});

	document.addEventListener("click", (event) => {
		const likeButton = event.target.closest("[data-like-question]");
		if (likeButton) {
			const likes = readMap("qa-hub-home-question-likes");
			const questionId = likeButton.dataset.likeQuestion;
			likes[questionId] = !likes[questionId];
			localStorage.setItem("qa-hub-home-question-likes", JSON.stringify(likes));
			syncQuestionCards();
		}

		const saveButton = event.target.closest("[data-save-question]");
		if (saveButton) {
			const saved = readList("qa-hub-home-saved-questions");
			const questionId = saveButton.dataset.saveQuestion;
			const nextSaved = saved.includes(questionId)
				? saved.filter((savedId) => savedId !== questionId)
				: [...saved, questionId];
			localStorage.setItem("qa-hub-home-saved-questions", JSON.stringify(nextSaved));
			syncQuestionCards();
		}

		const commentButton = event.target.closest("[data-toggle-comments]");
		if (commentButton) {
			const panel = document.getElementById(commentButton.getAttribute("aria-controls"));
			const isOpen = panel.hidden;
			panel.hidden = !isOpen;
			commentButton.setAttribute("aria-expanded", String(isOpen));
			if (isOpen) panel.querySelector("textarea")?.focus();
		}
	});

	document.addEventListener("submit", (event) => {
		const form = event.target.closest("[data-comment-form]");
		if (!form) return;

		event.preventDefault();
		const card = form.closest(".question-card");
		const questionId = card.dataset.question;
		const input = form.querySelector("textarea");
		const comments = readMap("qa-hub-home-question-comments");
		const questionComments = Array.isArray(comments[questionId]) ? comments[questionId] : [];
		questionComments.push(input.value.trim());
		comments[questionId] = questionComments;
		localStorage.setItem("qa-hub-home-question-comments", JSON.stringify(comments));
		input.value = "";
		syncQuestionCards();
		card.querySelector("[data-toggle-comments]").setAttribute("aria-expanded", "true");
		card.querySelector(".question-comments").hidden = false;
	});

	syncQuestionCards();
	setMenuOpen(false);
})();
