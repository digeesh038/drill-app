export const calculateScore = (answersArray, questions) => {
    let score = 0;

    answersArray.forEach(({ questionId, answer }) => {
        const question = questions.find(q => String(q.id) === String(questionId));
        if (
            question &&
            answer.trim().toLowerCase() === question.correctAnswer?.trim().toLowerCase()
        ) {
            score++;
        }
    });

    return score;
};
