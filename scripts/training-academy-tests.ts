import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { calculateQuizScore, passThreshold, trainingModules } from "../src/react-app/training/trainingContent.ts";

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

const requiredSlugs = [
  "phishing-basics",
  "password-safety",
  "popia-awareness",
  "suspicious-attachments",
  "alert-response",
];

for (const slug of requiredSlugs) {
  const module = trainingModules.find((item) => item.slug === slug);
  assert(module, `Missing required module: ${slug}`);
  assert(module!.lessons.length > 0, `Required module has no lessons: ${slug}`);
  assert(module!.quiz.length > 0, `Required module has no quiz: ${slug}`);
}

const phishing = trainingModules.find((item) => item.slug === "phishing-basics");
assert(phishing, "Phishing Basics module missing");
const correctAnswers = Object.fromEntries(phishing!.quiz.map((question) => [question.id, question.correctOptionId]));
const incorrectAnswers = Object.fromEntries(phishing!.quiz.map((question) => [question.id, "not-correct"]));
assert(calculateQuizScore(phishing!, correctAnswers) === 100, "Quiz scoring should return 100 for all correct answers");
assert(calculateQuizScore(phishing!, incorrectAnswers) < passThreshold, "Quiz scoring should fail below pass threshold for wrong answers");

const joinedCopy = JSON.stringify(trainingModules).toLowerCase();
for (const forbidden of ["soc 2", "iso 27001", "24/7 soc", "gdpr", "ai/ml threat detection is active"]) {
  assert(!joinedCopy.includes(forbidden), `Unsupported claim found in training content: ${forbidden}`);
}
assert(joinedCopy.includes("popia"), "Training content should use POPIA wording");

const migration = readFileSync(resolve("migrations/29.sql"), "utf8").toLowerCase();
for (const destructive of ["drop table", "delete from", "truncate", "alter table"]) {
  assert(!migration.includes(destructive), `Migration 29 should be additive only; found ${destructive}`);
}
for (const table of ["training_assignments", "training_progress", "training_quiz_attempts"]) {
  assert(migration.includes(`create table if not exists ${table}`), `Migration 29 missing ${table}`);
}

console.log("Training Academy tests passed");
