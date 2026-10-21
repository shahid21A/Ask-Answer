
(() => {
	const main = document.querySelector(".workspace main");
	const breadcrumbs = document.querySelector(".breadcrumbs");
	const navLinks = [...document.querySelectorAll(".sidebar nav [data-page]")];

	if (!main) return;

	const sidebarToggle = document.querySelector("#sidebar-toggle");
	const sidebarToggleButton = document.querySelector(".sidebar-toggle-button");

	function syncSidebarToggle() {
		if (!sidebarToggle || !sidebarToggleButton) return;
		const isExpanded = !sidebarToggle.checked;
		const label = isExpanded ? "Collapse sidebar" : "Expand sidebar";
		sidebarToggleButton.setAttribute("aria-expanded", String(isExpanded));
		sidebarToggleButton.setAttribute("aria-label", label);
		sidebarToggleButton.title = label;
		sidebarToggleButton.querySelector(".nav-text").textContent = label;
	}

	sidebarToggle?.addEventListener("change", syncSidebarToggle);
	sidebarToggleButton?.addEventListener("keydown", (event) => {
		if (event.key !== "Enter" && event.key !== " ") return;
		event.preventDefault();
		sidebarToggle.checked = !sidebarToggle.checked;
		sidebarToggle.dispatchEvent(new Event("change", { bubbles: true }));
	});
	syncSidebarToggle();

	const dashboardContent = main.innerHTML;
	const pages = {
		explore: {
		title: "Explore",
		description: "Find useful questions and discover topics worth following.",
		content: `<section class="explore-layout">
			<div class="explore-toolbar">
				<div><span class="section-kicker">DISCOVER</span><h2>What are you curious about?</h2></div>
				<label class="explore-search"><span class="sr-only">Search explored questions</span><input data-explore-search placeholder="Search questions" type="search"></label>
			</div>
			<section class="topic-section" aria-label="Browse topics">
				<div class="section-heading-row"><h2>Browse topics</h2><span>Choose a topic to filter</span></div>
				<div class="topic-filters" role="group" aria-label="Filter questions by topic">
					<button aria-pressed="true" class="topic-filter is-selected" data-topic-filter="all" type="button">All topics</button>
					<button aria-pressed="false" class="topic-filter" data-topic-filter="technology" type="button">Technology</button>
					<button aria-pressed="false" class="topic-filter" data-topic-filter="robotics" type="button">Robotics</button>
					<button aria-pressed="false" class="topic-filter" data-topic-filter="languages" type="button">Languages</button>
					<button aria-pressed="false" class="topic-filter" data-topic-filter="school" type="button">School subjects</button>
					<button aria-pressed="false" class="topic-filter" data-topic-filter="other" type="button">Others</button>
				</div>
			</section>
			<article class="explore-question" data-topic="technology">
				<div class="question-meta"><span class="topic-label">Technology</span><span>Answered · 12h ago</span></div>
				<h2>What is HTML?</h2>
				<p>A recent community question from the dashboard.</p>
				<div class="question-footer"><span>Junior Technologists</span><button class="save-question" data-save-question="html-basics" type="button">Save question</button></div>
				<div aria-label="Question actions" class="question-actions">
					<button aria-pressed="false" class="question-action like-question" data-like-question="html-basics" type="button"><svg aria-hidden="true" viewbox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"></path></svg><span>Like</span><span class="engagement-count" data-like-count>14</span></button>
					<button aria-controls="question-comments" aria-expanded="false" class="question-action" data-toggle-comments type="button"><svg aria-hidden="true" viewbox="0 0 24 24"><path d="M4 4h16v13H9l-5 4z"></path><path d="M8 9h8M8 13h5"></path></svg><span>Comment</span><span class="engagement-count" data-comment-count>1</span></button>
					<button aria-controls="question-answer-panel" aria-expanded="false" class="question-action answer-action" data-toggle-answer type="button"><svg aria-hidden="true" viewbox="0 0 24 24"><path d="M12 20V4m-6 6 6-6 6 6"></path></svg><span>Answer</span></button>
				</div>
				<section aria-label="Question comments" class="question-discussion" id="question-comments" hidden>
					<div class="response-list" data-response-list>
						<article class="community-response"><div><strong>Mahdi</strong><time>2h ago</time></div><p>HTML gives structure to the content shown in a web browser.</p></article>
					</div>
					<form class="response-form" data-comment-form>
						<label class="sr-only" for="question-comment">Write a comment</label>
						<textarea id="question-comment" maxlength="500" placeholder="Add to the discussion..." required rows="2"></textarea>
						<button class="response-submit" type="submit">Comment</button>
					</form>
				</section>
				<section aria-label="Write an answer" class="answer-panel" id="question-answer-panel" hidden>
					<form class="response-form" data-answer-form>
						<label for="question-answer">Your answer</label>
						<textarea id="question-answer" maxlength="2000" placeholder="Share a clear, helpful answer..." required rows="4"></textarea>
						<button class="response-submit" type="submit">Post answer</button>
					</form>
				</section>
			</article>
			<p class="empty-message explore-empty" data-explore-empty hidden>No questions found for this topic. Try another topic or search.</p>
		</section>`,
		},
		"my-questions": {
			title: "My questions",
			description: "Keep track of the questions you have asked.",
			content: `<section class="empty-state">
				<div aria-hidden="true" class="empty-state-icon question-empty-icon">?</div>
				<p class="section-kicker">YOUR ACTIVITY</p>
				<h2>No questions yet</h2>
				<p>Your questions will appear here after you post one.</p>
				<a class="primary-link" href="#explore">Explore questions</a>
			</section>`,
		},
		saved: {
			title: "Saved",
			description: "Questions you save for later, all in one place.",
			content: `<section aria-label="Saved questions" class="saved-question-list"></section>
			<section class="empty-state saved-empty">
				<div aria-hidden="true" class="empty-state-icon bookmark-empty-icon">☆</div>
				<p class="section-kicker">YOUR READING LIST</p>
				<h2>No saved questions</h2>
				<p>Save a useful question from Explore and it will be waiting here.</p>
				<a class="primary-link" href="#explore">Explore questions</a>
			</section>`,
		},
		notifications: {
			title: "Notifications",
			description: "Recent activity and updates from your learning community.",
			content: `<section class="notification-center">
				<div class="notification-center-heading"><h2>Recent activity</h2><button class="mark-all-read" data-mark-all-read type="button">Mark all read</button></div>
				<ul class="notification-list notification-feed">
					<li><a class="notification-item" href="#my-questions"><i class="notification-unread" aria-hidden="true"></i><span><strong>4 unanswered questions</strong><small>Students are waiting for an answer.</small><time>24 minutes ago</time></span></a></li>
					<li><a class="notification-item" href="#explore"><i class="notification-unread" aria-hidden="true"></i><span><strong>Student activity is up</strong><small>Student activity increased by 10% this week.</small><time>Today</time></span></a></li>
					<li><a class="notification-item" href="#my-questions"><i class="notification-unread" aria-hidden="true"></i><span><strong>Weekly question summary</strong><small>100 questions have been answered.</small><time>Yesterday</time></span></a></li>
				</ul>
			</section>`,
		},
		messages: {
			title: "Messages",
			description: "Private conversations with your learning community.",
			content: `<section class="messages-layout">
				<div aria-label="Conversation list" class="conversation-list"><div class="conversation-list-heading"><h2>Inbox</h2><span>0 conversations</span></div><p class="conversation-empty">Your inbox is clear.</p></div>
				<div class="message-empty-state"><div aria-hidden="true" class="message-empty-icon"><svg viewbox="0 0 64 64"><path d="M12 14h40v29H31L18 53v-10h-6z"></path><path d="M23 25h18M23 33h12"></path></svg></div><h2>No messages yet</h2><p>Conversations with students and teachers will appear here.</p></div>
			</section>`,
		},
		settings: {
			title: "Settings",
			description: "Choose how you want to stay informed.",
			content: `<section class="settings-layout">
				<div class="settings-section"><div class="settings-section-heading"><span class="settings-symbol">◎</span><div><h2>Notifications</h2><p>Control which updates you receive.</p></div></div>
					<label class="settings-row"><span><strong>Question activity</strong><small>Updates when questions need attention.</small></span><input checked data-preference="questionActivity" type="checkbox"></label>
					<label class="settings-row"><span><strong>Messages</strong><small>Alerts when someone contacts you.</small></span><input checked data-preference="messages" type="checkbox"></label>
					<label class="settings-row"><span><strong>Weekly summary</strong><small>A short digest of community activity.</small></span><input data-preference="weeklySummary" type="checkbox"></label>
					<p aria-live="polite" class="settings-saved" data-settings-status>Preferences are saved in this browser.</p>
				</div>
			</section>`,
		},
	};

	const savedQuestionId = "html-basics";

	function readStoredValue(key, fallback) {
		try {
			const value = localStorage.getItem(key);
			return value === null ? fallback : JSON.parse(value);
		} catch {
			return fallback;
		}
	}

	function getSavedQuestions() {
		const saved = readStoredValue("qa-hub-saved-questions", []);
		return Array.isArray(saved) ? saved : [];
	}

	function renderSavedPage() {
		const list = main.querySelector(".saved-question-list");
		const emptyState = main.querySelector(".saved-empty");
		if (!list || !emptyState) return;

		const isSaved = getSavedQuestions().includes(savedQuestionId);
		emptyState.hidden = isSaved;
		list.innerHTML = isSaved
			? `<article class="saved-question-card"><div><span class="topic-label">Technology</span><h2>What is HTML?</h2><p>Junior Technologists · Answered</p></div><button class="save-question is-saved" data-save-question="${savedQuestionId}" type="button">Remove</button></article>`
			: "";
	}

	function syncNotificationReadState() {
		const isRead = readStoredValue("qa-hub-notifications-read", false);
		if (!isRead) return;

		document.querySelectorAll(".notification-unread").forEach((indicator) => indicator.remove());
		document.querySelectorAll(".popover-subtitle").forEach((subtitle) => {
			subtitle.textContent = "You're all caught up";
		});
		document.querySelectorAll("[data-mark-all-read]").forEach((button) => {
			button.disabled = true;
		});
		const badge = document.querySelector(".bell i");
		const bell = document.querySelector(".bell");
		if (badge) badge.hidden = true;
		if (bell) bell.setAttribute("aria-label", "Notifications");
	}

	function syncPreferences() {
		const preferences = readStoredValue("qa-hub-admin-preferences", {});
		main.querySelectorAll("[data-preference]").forEach((input) => {
			if (typeof preferences[input.dataset.preference] === "boolean") {
				input.checked = preferences[input.dataset.preference];
			}
		});
	}

	function filterExploreQuestions() {
		const question = main.querySelector(".explore-question");
		const emptyState = main.querySelector(".explore-empty");
		if (!question || !emptyState) return;

		const topic = main.querySelector(".topic-filter[aria-pressed='true']")?.dataset.topicFilter || "all";
		const query = main.querySelector("[data-explore-search]")?.value.trim().toLowerCase() || "";
		const matches = (topic === "all" || topic === question.dataset.topic) && question.textContent.toLowerCase().includes(query);
		question.hidden = !matches;
		emptyState.hidden = matches;
	}

	function readQuestionMap(key) {
		const value = readStoredValue(key, {});
		return value && typeof value === "object" && !Array.isArray(value) ? value : {};
	}

	function appendResponse(container, className, author, text) {
		const response = document.createElement("article");
		response.className = `community-response ${className}`;
		const heading = document.createElement("div");
		const name = document.createElement("strong");
		const time = document.createElement("time");
		const body = document.createElement("p");
		name.textContent = author;
		time.textContent = "Just now";
		body.textContent = text;
		heading.append(name, time);
		response.append(heading, body);
		container.append(response);
	}

	function syncExploreActivity() {
		const likeButton = main.querySelector("[data-like-question]");
		const responseList = main.querySelector("[data-response-list]");
		if (!likeButton || !responseList) return;

		const likedQuestions = readQuestionMap("qa-hub-question-likes");
		const isLiked = Boolean(likedQuestions[savedQuestionId]);
		likeButton.setAttribute("aria-pressed", String(isLiked));
		likeButton.classList.toggle("is-liked", isLiked);
		main.querySelector("[data-like-count]").textContent = String(14 + Number(isLiked));

		responseList.querySelectorAll(".user-response").forEach((response) => response.remove());
		const comments = readStoredValue("qa-hub-question-comments", []);
		const answers = readStoredValue("qa-hub-question-answers", []);
		if (Array.isArray(comments)) {
			comments.forEach((text) => appendResponse(responseList, "user-response", "You", text));
		}
		if (Array.isArray(answers)) {
			answers.forEach((text) => appendResponse(responseList, "user-response user-answer", "Your answer", text));
		}
		main.querySelector("[data-comment-count]").textContent = String(1 + (Array.isArray(comments) ? comments.length : 0));
	}

	function renderPage() {
		const pageId = window.location.hash.slice(1) || "dashboard";
		const page = pages[pageId];

		if (pageId === "dashboard") {
			main.innerHTML = dashboardContent;
		} else if (page) {
			main.innerHTML = `<header class="page-heading">
				<h1>${page.title}</h1>
				<p class="subtitle">${page.description}</p>
			</header>${page.content}`;
		} else {
			return;
		}

		if (breadcrumbs) breadcrumbs.textContent = `Home / ${page?.title || "Dashboard"}`;
		document.title = `${page?.title || "Dashboard"} | Q&A Hub Admin`;

		navLinks.forEach((link) => {
			const isCurrent = link.dataset.page === pageId;
			link.classList.toggle("active", isCurrent);
			if (isCurrent) link.setAttribute("aria-current", "page");
			else link.removeAttribute("aria-current");
		});

		if (pageId === "saved") renderSavedPage();
		if (pageId === "settings") syncPreferences();
		if (pageId === "explore") {
			syncExploreActivity();
			filterExploreQuestions();
		}
		syncNotificationReadState();
	}

	const popoverButtons = [...document.querySelectorAll(".header-popover [aria-controls]")];

	function closePopovers() {
		popoverButtons.forEach((button) => {
			button.setAttribute("aria-expanded", "false");
			document.getElementById(button.getAttribute("aria-controls")).hidden = true;
		});
	}

	popoverButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const panel = document.getElementById(button.getAttribute("aria-controls"));
			const shouldOpen = panel.hidden;
			closePopovers();
			panel.hidden = !shouldOpen;
			button.setAttribute("aria-expanded", String(shouldOpen));
		});
	});

	document.addEventListener("click", (event) => {
		if (!event.target.closest(".header-popover")) closePopovers();
		if (event.target.closest(".popover-panel a")) closePopovers();
	});

	document.addEventListener("keydown", (event) => {
		if (event.key !== "Escape") return;
		const openButton = popoverButtons.find(
			(button) => button.getAttribute("aria-expanded") === "true",
		);
		if (!openButton) return;
		closePopovers();
		openButton.focus();
	});

	document.addEventListener("click", (event) => {
		const likeButton = event.target.closest("[data-like-question]");
		if (likeButton) {
			const likedQuestions = readQuestionMap("qa-hub-question-likes");
			likedQuestions[savedQuestionId] = !likedQuestions[savedQuestionId];
			localStorage.setItem("qa-hub-question-likes", JSON.stringify(likedQuestions));
			syncExploreActivity();
		}

		const commentToggle = event.target.closest("[data-toggle-comments]");
		const answerToggle = event.target.closest("[data-toggle-answer]");
		if (commentToggle || answerToggle) {
			const isComment = Boolean(commentToggle);
			const button = commentToggle || answerToggle;
			const panel = document.getElementById(button.getAttribute("aria-controls"));
			const shouldOpen = panel.hidden;
			const otherButton = main.querySelector(isComment ? "[data-toggle-answer]" : "[data-toggle-comments]");
			const otherPanel = document.getElementById(otherButton.getAttribute("aria-controls"));
			panel.hidden = !shouldOpen;
			button.setAttribute("aria-expanded", String(shouldOpen));
			otherPanel.hidden = true;
			otherButton.setAttribute("aria-expanded", "false");
			if (shouldOpen) panel.querySelector("textarea")?.focus();
		}

		const topicButton = event.target.closest("[data-topic-filter]");
		if (topicButton) {
			main.querySelectorAll("[data-topic-filter]").forEach((button) => {
				const isSelected = button === topicButton;
				button.classList.toggle("is-selected", isSelected);
				button.setAttribute("aria-pressed", String(isSelected));
			});
			filterExploreQuestions();
		}

		const saveButton = event.target.closest("[data-save-question]");
		if (saveButton) {
			const saved = getSavedQuestions();
			const questionId = saveButton.dataset.saveQuestion;
			const isSaved = saved.includes(questionId);
			const nextSaved = isSaved ? saved.filter((id) => id !== questionId) : [...saved, questionId];
			localStorage.setItem("qa-hub-saved-questions", JSON.stringify(nextSaved));
			if (window.location.hash === "#saved") renderSavedPage();
			else {
				saveButton.classList.toggle("is-saved", !isSaved);
				saveButton.textContent = isSaved ? "Save question" : "Saved";
				filterExploreQuestions();
			}
		}

		if (event.target.closest("[data-mark-all-read]")) {
			localStorage.setItem("qa-hub-notifications-read", "true");
			syncNotificationReadState();
		}
	});

	document.addEventListener("submit", (event) => {
		const commentForm = event.target.closest("[data-comment-form]");
		const answerForm = event.target.closest("[data-answer-form]");
		if (!commentForm && !answerForm) return;

		event.preventDefault();
		const isComment = Boolean(commentForm);
		const form = commentForm || answerForm;
		const input = form.querySelector("textarea");
		const key = isComment ? "qa-hub-question-comments" : "qa-hub-question-answers";
		const savedResponses = readStoredValue(key, []);
		const responses = Array.isArray(savedResponses) ? savedResponses : [];
		responses.push(input.value.trim());
		localStorage.setItem(key, JSON.stringify(responses));
		input.value = "";

		if (isComment) {
			syncExploreActivity();
		} else {
			const answerPanel = main.querySelector("#question-answer-panel");
			const answerToggle = main.querySelector("[data-toggle-answer]");
			const commentPanel = main.querySelector("#question-comments");
			const commentToggle = main.querySelector("[data-toggle-comments]");
			answerPanel.hidden = true;
			answerToggle.setAttribute("aria-expanded", "false");
			commentPanel.hidden = false;
			commentToggle.setAttribute("aria-expanded", "true");
			syncExploreActivity();
		}
	});

	document.addEventListener("input", (event) => {
		if (event.target.matches("[data-explore-search]")) filterExploreQuestions();
	});

	document.addEventListener("change", (event) => {
		if (!event.target.matches("[data-preference]")) return;
		const preferences = readStoredValue("qa-hub-admin-preferences", {});
		preferences[event.target.dataset.preference] = event.target.checked;
		localStorage.setItem("qa-hub-admin-preferences", JSON.stringify(preferences));
		const status = main.querySelector("[data-settings-status]");
		if (status) status.textContent = "Preference saved in this browser.";
	});

	window.addEventListener("hashchange", renderPage);
	renderPage();
})();
