"use client";

import { useEffect, useState } from "react";

export default function GitTerminal() {
  const [text, setText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    // Blinking cursor
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const sequence = [
      { text: "> git add -A", type: "type", delay: 50 },
      { text: "\n> git commit -m \"first commit\"", type: "type", delay: 40 },
      { text: "", type: "wait", delay: 800 },
      { text: 14, type: "delete", delay: 30 }, // delete "first commit"
      { text: "\"first push\"", type: "type", delay: 50 },
      { text: "", type: "wait", delay: 600 },
      { text: 12, type: "delete", delay: 30 }, // delete "first push"
      { text: "\"lpushat lmla7\"", type: "type", delay: 60 },
      { text: "", type: "wait", delay: 1000 },
      { text: "\n> git push", type: "type", delay: 50 },
      { text: "\n\nEnumerating objects: 42, done.\nCounting objects: 100% (42/42), done.\nDelta compression using up to 10 threads\nCompressing objects: 100% (42/42), done.\nWriting objects: 100% (42/42), 42.00 KiB | 42.00 MiB/s, done.\nTotal 42 (delta 42), reused 0 (delta 0), pack-reused 0 (from 0)\nTo github.com:leet-folks/leet-folks.git\n   c8f617c..89c7545  main -> main", type: "print", delay: 0 },
      { text: "", type: "wait", delay: 1200 },
      { text: "\n\n> grademe", type: "type", delay: 60 },
      { text: "", type: "wait", delay: 1000 },
      { text: "\n<span style='color: #ff5f56; font-weight: bold;'>[FAIL]</span> Segmentation fault (core dumped)", type: "print", delay: 0 },
      { text: "", type: "wait", delay: 5000 },
      { text: "clear", type: "action", delay: 0 },
    ];

    let currentStep = 0;
    let currentText = "";

    const processSequence = async () => {
      if (currentStep >= sequence.length) {
        currentStep = 0; // Loop the animation
      }

      const step = sequence[currentStep];

      if (step.type === "type") {
        const textToType = step.text as string;
        for (let i = 0; i < textToType.length; i++) {
          currentText += textToType[i];
          setText(currentText);
          await new Promise((r) => setTimeout(r, step.delay));
        }
      } else if (step.type === "delete") {
        const deleteCount = step.text as number;
        for (let i = 0; i < deleteCount; i++) {
          currentText = currentText.slice(0, -1);
          setText(currentText);
          await new Promise((r) => setTimeout(r, step.delay));
        }
      } else if (step.type === "wait") {
        await new Promise((r) => setTimeout(r, step.delay));
      } else if (step.type === "print") {
        currentText += step.text as string;
        setText(currentText);
      } else if (step.type === "action" && step.text === "clear") {
        currentText = "";
        setText(currentText);
      }

      currentStep++;
      timeoutId = setTimeout(processSequence, step.type === "print" ? 500 : 10);
    };

    timeoutId = setTimeout(processSequence, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="gitTerminal">
      <div className="gitTerminalHeader">
        <div className="gitTerminalBtns">
          <span className="gitBtn red"></span>
          <span className="gitBtn yellow"></span>
          <span className="gitBtn green"></span>
        </div>
        <div className="gitTerminalTitle">bash — aaitelka@macbook</div>
      </div>
      <div className="gitTerminalBody">
        <pre>
          <span dangerouslySetInnerHTML={{ __html: text }} />
          <span className={`gitCursor ${showCursor ? 'visible' : 'hidden'}`}>_</span>
        </pre>
      </div>
    </div>
  );
}
