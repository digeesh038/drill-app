function calculateScore(userAnswers, drillQuestions) {
  let score = 0;

  if (!Array.isArray(userAnswers) || !Array.isArray(drillQuestions)) return 0;

  drillQuestions.forEach((q) => {
    const userAnsDoc = userAnswers.find(
      (a) => String(a.questionId) === String(q.id)
    );

    if (!userAnsDoc || !userAnsDoc.answer) return;

    const userAns = userAnsDoc.answer;
    const type = q.type || 'fillup';

    if (type === 'checkbox') {
      // Multi-select: userAns and q.correctAnswers should both be arrays
      const userArray = Array.isArray(userAns) ? userAns : [userAns];
      const correctArray = q.correctAnswers || (q.correctAnswer ? [q.correctAnswer] : []);

      if (userArray.length === correctArray.length) {
        const sortedUser = [...userArray].map(v => v.trim().toLowerCase()).sort();
        const sortedCorrect = [...correctArray].map(v => v.trim().toLowerCase()).sort();

        const isMatch = sortedUser.every((val, index) => val === sortedCorrect[index]);
        if (isMatch) score++;
      }
    } else {
      // MCQ/Fillup: Single string match
      const correct = q.correctAnswer || (q.correctAnswers && q.correctAnswers[0]) || "";
      if (
        userAns.toString().trim().toLowerCase() ===
        correct.toString().trim().toLowerCase()
      ) {
        score++;
      }
    }
  });

  return score;
}

export { calculateScore };
