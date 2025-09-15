function calculateScore(userAnswers, drillQuestions) {
  let score = 0;

  if (!Array.isArray(userAnswers) || !Array.isArray(drillQuestions)) return 0;

  drillQuestions.forEach((q) => {
    // normalize IDs to string
    const userAns = userAnswers.find(
      (a) => String(a.questionId) === String(q.id)
    );

    if (
      userAns &&
      userAns.answer &&
      q.correctAnswer &&
      userAns.answer.trim().toLowerCase() ===
        q.correctAnswer.trim().toLowerCase()
    ) {
      score++;
    }
  });

  return score;
}

export { calculateScore };
