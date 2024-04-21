import React from "react";
import { useState } from "react";

// Define the WorkoutTemplate interface
interface WorkoutTemplate {
  template_name: string;
  workouts: Workout[];
}

// Define the Workout interface
interface Workout {
  workout_name: string;
  sets: Set[];
}

// Define the Set interface
interface Set {
  set_number: number;
  kilos: number;
  reps: number;
}

// Define the functional component
const WorkoutTemplateParser: React.FC<{ gptString: string }> = ({
  gptString,
}) => {
  const [parsedTemplate, setParsedTemplate] = useState<WorkoutTemplate | null>(
    null
  );

  // Define the function to parse the workout template string
  const parseWorkoutTemplate = (inputString: string): void => {
    // Regular expression to match sets information
    const setRegex = /Set (\d+): Kilos: (\d+), Reps: (\d+)/g;

    // Match template name
    const templateNameMatch = inputString.match(/Template: (.+?),/);
    const templateName = templateNameMatch ? templateNameMatch[1] : "";

    // Match workout name
    const workoutNameMatch = inputString.match(/Workout: (.+?),/);
    const workoutName = workoutNameMatch ? workoutNameMatch[1] : "";

    // Match number of sets
    const setsMatch = inputString.match(/Sets: (\d+)/);
    const numberOfSets = setsMatch ? parseInt(setsMatch[1]) : 0;

    // Match sets information
    const sets: Set[] = [];
    let setInfo;
    while ((setInfo = setRegex.exec(inputString)) !== null) {
      sets.push({
        set_number: parseInt(setInfo[1]),
        kilos: parseInt(setInfo[2]),
        reps: parseInt(setInfo[3]),
      });
    }

    // Construct the workout template object
    const workoutTemplate: WorkoutTemplate = {
      template_name: templateName,
      workouts: [
        {
          workout_name: workoutName,
          sets: sets,
        },
      ],
    };

    // Set the parsed template state
    setParsedTemplate(workoutTemplate);
  };

  // Parse the input string when component mounts
  React.useEffect(() => {
    parseWorkoutTemplate(gptString);
  }, [gptString]);

  // Render the parsed template
  return (
    <div>
      <h2>Parsed Workout Template</h2>
      {parsedTemplate && (
        <div>
          <h3>{parsedTemplate.template_name}</h3>
          {parsedTemplate.workouts.map((workout, index) => (
            <div key={index}>
              <h4>{workout.workout_name}</h4>
              <ul>
                {workout.sets.map((set, setIndex) => (
                  <li key={setIndex}>
                    Set {set.set_number}: {set.kilos} kg, {set.reps} reps
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutTemplateParser;
