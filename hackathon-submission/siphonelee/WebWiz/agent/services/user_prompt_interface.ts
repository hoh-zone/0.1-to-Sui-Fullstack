import readline from "readline";

export const userPromptInterface = async (query: string) => {
  const userInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<string>((resolve) => {
    userInterface.question(query, (input) => {
      resolve(input);
      userInterface.close(); // Close the user interface
    });
  });
};
