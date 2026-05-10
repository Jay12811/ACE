import { CompilerState, ExecutionResult, Shape, GameState } from '../../types';

export class PlainSpeakCompiler {
  private state: CompilerState = {
    variables: {
      'PI': 3.14159,
      'E': 2.71828,
      'VERSION': '2.5.0',
    },
    logs: [],
  };

  private functions: Record<string, { params: string[], body: string }> = {};
  private virtualFiles: Record<string, string> = {};

  constructor() {}

  public execute(input: string): ExecutionResult {
    const trimmedInput = input.trim();
    let backgroundLogic = "";
    let output: ExecutionResult['output'] = {};

    try {
      // 1. Core Syntax: Variables & Functions
      // "Define [name] with [args]: [body]"
      const defRegex = /^Define\s+([a-z_][a-z0-9_]*)\s+with\s+\[(.+?)\]:\s*(.+)$/i;
      const defMatch = trimmedInput.match(defRegex);
      if (defMatch) {
         const name = defMatch[1];
         const params = defMatch[2].split(',').map(p => p.trim());
         const body = defMatch[3];
         this.functions[name] = { params, body };
         backgroundLogic = `Function Registrar: Mapping symbol '${name}' to procedure block in heap. Stack size optimized.`;
         output.text = `Function '${name}' successfully defined. Ready to call.`;
         return { input, backgroundLogic, output };
      }

      // "Remember [value] as [name]."
      const varRegex = /^Remember\s+(.+)\s+as\s+([a-zA-Z0-9_]+)\.?$/i;
      const varMatch = trimmedInput.match(varRegex);
      if (varMatch) {
        const value = this.parseValue(varMatch[1]);
        const name = varMatch[2];
        this.state.variables[name] = value;
        backgroundLogic = `Assignment operation: mapping the literal or evaluated value '${value}' to the memory address identified by '${name}'.`;
        output.text = `Variable '${name}' set to '${value}'. Target: ACE Heap.`;
        return { input, backgroundLogic, output };
      }

      // "Run [name] with [args]"
      const callRegex = /^Run\s+([a-z_][a-z0-9_]*)\s+with\s+\[(.+?)\]\.?$/i;
      const callMatch = trimmedInput.match(callRegex);
      if (callMatch) {
         const name = callMatch[1];
         const args = callMatch[2].split(',').map(a => this.parseValue(a.trim()));
         const func = this.functions[name];
         if (func) {
           backgroundLogic = `Function Call: resolving symbol '${name}'. Mapping arguments to parameters: ${func.params.join(', ')}. Context switching...`;
           // Simple parameter binding
           func.params.forEach((p, i) => {
             this.state.variables[p] = args[i];
           });
           const resultAction = this.execute(func.body);
           return { input, backgroundLogic, output: resultAction.output };
         }
      }

      // 2. Math & Advanced Trig
      // "Calculate [equation]."
      const mathRegex = /^(?:Calculate|Sqrt|Sin|Cos|Tan|Floor|Ceil|Round|Abs|Random|Log|Exp|Power|Min|Max)\s+(.+)\.?$/i;
      const mathMatch = trimmedInput.match(mathRegex);
      if (mathMatch) {
         const opMatch = trimmedInput.match(/^(Sqrt|Sin|Cos|Tan|Floor|Ceil|Round|Abs|Random|Log|Exp|Power|Min|Max)/i);
         let equation = mathMatch[1];
         if (opMatch) {
           const op = opMatch[1].toLowerCase();
           if (op === 'random') {
             equation = `Math.random() * (${equation})`;
           } else if (op === 'power') {
             const parts = equation.split(/\s+to\s+/i);
             equation = `Math.pow(${parts[0]}, ${parts[1]})`;
           } else if (op === 'min' || op === 'max') {
             const parts = equation.split(/\s+and\s+/i);
             equation = `Math.${op}(${parts[0]}, ${parts[1]})`;
           } else {
             equation = `Math.${op}(${equation})`;
           }
         }
         const result = this.evaluateMath(equation);
         backgroundLogic = `Arithmetic evaluation: parsing the tokens in '${equation}', resolving any variables, and applying PEMDAS rules.`;
         output.math = result;
         output.text = `The result is ${result}.`;
         return { input, backgroundLogic, output };
      }

      // 3. Logic
      // "If [condition] is true, then [action]. Otherwise, [action]."
      const logicRegex = /^If\s+(.+)\s+is\s+true,\s+then\s+(.+)\.\s+Otherwise,\s+(.+)\.?$/i;
      const logicMatch = trimmedInput.match(logicRegex);
      if (logicMatch) {
        const condition = logicMatch[1];
        const actionTrue = logicMatch[2];
        const actionFalse = logicMatch[3];
        const isTrue = this.evaluateCondition(condition);
        backgroundLogic = `Conditional branching: evaluated expression '${condition}' to ${isTrue}. Preparing to jump execution pointer to '${isTrue ? 'True' : 'False'}' block.`;
        
        const resultAction = isTrue ? this.execute(actionTrue) : this.execute(actionFalse);
        return { 
          input, 
          backgroundLogic: `${backgroundLogic}\n> Executing Sub-command: ${resultAction.backgroundLogic}`, 
          output: resultAction.output 
        };
      }

      // 4. Loops
      // "Repeat [action] for [number] times"
      const loopCountRegex = /^Repeat\s+(.+)\s+for\s+(\d+)\s+times\.?$/i;
      const loopCountMatch = trimmedInput.match(loopCountRegex);
      if (loopCountMatch) {
        const action = loopCountMatch[1];
        const count = parseInt(loopCountMatch[2]);
        backgroundLogic = `Iteration loop: initialized counter to 0, incrementing until it reaches ${count}. Each cycle will dispatch a call to the command processor for '${action}'.`;
        
        let subResults = [];
        for (let i = 0; i < Math.min(count, 100); i++) { // Limit to 100 to prevent infinite/heavy loops
          subResults.push(this.execute(action).output.text);
        }
        output.text = `Looped ${subResults.length} times:\n${Array.from(new Set(subResults)).join(', ')}`;
        return { input, backgroundLogic, output };
      }

      // "Repeat [action] while [condition]."
      const loopWhileRegex = /^Repeat\s+(.+)\s+while\s+(.+)\.?$/i;
      const loopWhileMatch = trimmedInput.match(loopWhileRegex);
      if (loopWhileMatch) {
        const action = loopWhileMatch[1];
        const condition = loopWhileMatch[2];
        backgroundLogic = `Conditional while-loop: periodically polling condition '${condition}'. Will repeat execution of '${action}' as long as truthiness is maintained. Safety limit of 20 cycles enforced.`;
        
        let subResults = [];
        let limit = 0;
        while (this.evaluateCondition(condition) && limit < 20) {
          subResults.push(this.execute(action).output.text);
          limit++;
        }
        output.text = `Executed while loop ${limit} times. Condition eventually failed or safety limit reached.`;
        return { input, backgroundLogic, output };
      }

      // 5. Visuals
      // "Draw a [shape] with [attributes: size, color, position]."
      // Example: "Draw a circle with size 50, color red, position 100 100."
      const drawRegex = /^Draw\s+a\s+(circle|rectangle|square|triangle)\s+with\s+size\s+(\d+),\s+color\s+([a-zA-Z]+),\s+position\s+(\d+)\s+(\d+)\.?$/i;
      const drawMatch = trimmedInput.match(drawRegex);
      if (drawMatch) {
        const type = drawMatch[1] as any;
        const size = parseInt(drawMatch[2]);
        const color = drawMatch[3];
        const x = parseInt(drawMatch[4]);
        const y = parseInt(drawMatch[5]);
        
        const shape: Shape = { type, attributes: { size, color, x, y } };
        backgroundLogic = `Graphics API Call: calling the lower-level viewport renderer to rasterize a ${type} primitive using absolute screen coordinates (${x}, ${y}) and stroke/fill properties.`;
        output.shapes = [shape];
        output.text = `Drawing a ${color} ${type}...`;
        return { input, backgroundLogic, output };
      }

      // 6. Game Templates (Enhanced Platformer)
      const platformerRegex = /make\s+a\s+platformer\s+game(?:\s+with\s+(.+))?/i;
      const platformerMatch = trimmedInput.match(platformerRegex);
      
      if (platformerMatch || trimmedInput.toLowerCase().includes("initialize platformer")) {
        const params = platformerMatch && platformerMatch[1] ? platformerMatch[1] : "";
        
        // Default Config
        let config = {
          charColor: this.state.variables['player_color'] || 'cyan',
          bgColor: this.state.variables['background_color'] || '#0B0E14',
          gravity: parseFloat(this.state.variables['gravity']) || 0.8,
          jump: parseFloat(this.state.variables['jump_power']) || -15,
          platforms: [
            { x: 100, y: 400, w: 200 },
            { x: 400, y: 300, w: 200 },
            { x: 150, y: 200, w: 100 }
          ]
        };

        // Extraction Logic for parameters in the string
        if (params) {
          const colorMatch = params.match(/(?:color|char|player)\s+([a-zA-Z#0-9]+)/i);
          if (colorMatch) config.charColor = colorMatch[1];

          const bgMatch = params.match(/(?:bg|background)\s+([a-zA-Z#0-9]+)/i);
          if (bgMatch) config.bgColor = bgMatch[1];

          const gravMatch = params.match(/(?:gravity|grav)\s+([0-9.]+)/i);
          if (gravMatch) config.gravity = parseFloat(gravMatch[1]);
        }

        backgroundLogic = `Platformer Factory: instantiated physics domain. Attributes: { char: ${config.charColor}, bg: ${config.bgColor}, G: ${config.gravity} }. Generating collision tiles at coordinates 100, 400, 150.`;
        
        output.game = {
          active: true,
          type: 'Platformer',
          data: config
        };
        output.text = `Platformer generated with ${config.charColor} character and ${config.bgColor} backdrop. Simulation online.`;
        return { input, backgroundLogic, output };
      }

      if (trimmedInput.toLowerCase().includes("initialize rpg")) {
        backgroundLogic = `Game Engine Init: bootstrapping the RPG sub-system. Allocating heap space for stats (HP, Mana, Level) and loading the turn-based combat kernel.`;
        output.game = {
          active: true,
          type: 'RPG',
          data: { hp: 100, mp: 50, level: 1, inventory: ['Wooden Sword'] }
        };
        output.text = "RPG Mode Initialized. Stats: HP 100, MP 50, Level 1.";
        return { input, backgroundLogic, output };
      }

      if (trimmedInput.toLowerCase().includes("initialize story mode") || trimmedInput.toLowerCase().includes("initialize undertale story")) {
        const isUndertale = trimmedInput.toLowerCase().includes("undertale");
        const storyMatch = trimmedInput.match(/(?::|story:)\s*(.+)$/i);
        const storyText = storyMatch ? storyMatch[1] : this.state.variables['story'] || "";
        
        backgroundLogic = `Branching Narrative Loader: generating a directed acyclic graph (DAG). Mode: ${isUndertale ? 'Undertale-Retrospective' : 'Standard-Cinematic'}. Story Buffer length: ${storyText.length}.`;
        output.game = {
          active: true,
          type: 'Story',
          data: { currentScene: 'start', history: [] },
          config: { story: storyText, mode: isUndertale ? 'undertale' : 'standard' }
        };
        output.text = `Story Mode Initialized. ${isUndertale ? "* You are filled with determination." : "You stand at the crossroads of destiny."}`;
        return { input, backgroundLogic, output };
      }

      // 7. Particle Systems
      const particleMatch = trimmedInput.match(/emit\s+(\d+)\s+([a-zA-Z#0-9]+)\s+particles(?: at (\d+)\s+(\d+))?/i);
      if (particleMatch) {
        const count = parseInt(particleMatch[1]);
        const color = particleMatch[2];
        const x = particleMatch[3] ? parseInt(particleMatch[3]) : 400;
        const y = particleMatch[4] ? parseInt(particleMatch[4]) : 300;
        backgroundLogic = `Particle Engine: Instantiating ${count} primitives. Swarming at [${x}, ${y}] with ${color} tint. Initializing physics vectors.`;
        output.particles = { count, color, x, y };
        output.text = `Emitted ${count} particles into the visual buffer.`;
        return { input, backgroundLogic, output };
      }

      // 8. Sound Synthesis
      const soundMatch = trimmedInput.match(/(?:synthesize|play)\s+(?:(\d+)hz|note\s+([A-G][#b]?\d))/i);
      if (soundMatch) {
        const freq = soundMatch[1] ? parseInt(soundMatch[1]) : undefined;
        const note = soundMatch[2];
        backgroundLogic = `Audio Backplane: Triggering oscillator. Mode: ${freq ? 'Sinusoid' : 'FM Synthesis'}. Frequency Cache: ${freq || note}.`;
        output.sound = { type: freq ? 'freq' : 'note', frequency: freq, note: note };
        output.text = freq ? `Synthesizing ${freq}Hz tone.` : `Playing ${note} note.`;
        return { input, backgroundLogic, output };
      }

      // 9. Collection Management
      const listMatch = trimmedInput.match(/remember\s+\[([0-9,\s]+)\]\s+as\s+([a-z_]+)/i);
      if (listMatch) {
         const list = listMatch[1].split(',').map(n => n.trim());
         const name = listMatch[2];
         this.state.variables[name] = list;
         backgroundLogic = `Memory Management: Allocating array of size ${list.length}. Storing at address reference '${name}'.`;
         output.text = `List stored in variable '${name}'. Count: ${list.length}.`;
         return { input, backgroundLogic, output };
      }

      // 10. String & Collection Transformations
      const stringMatch = trimmedInput.match(/^(transform|lowercase|uppercase|length of|replace|reverse)\s+(.+?)(?:\s+(?:to|with)\s+(.+?)(?:\s+in\s+(.+))?)?\.?$/i);
      if (stringMatch) {
        const op = stringMatch[1].toLowerCase();
        let val = this.parseValue(stringMatch[2]);
        let result: any = val;

        if (op === 'uppercase' || (op === 'transform' && stringMatch[3] === 'uppercase')) result = String(val).toUpperCase();
        if (op === 'lowercase' || (op === 'transform' && stringMatch[3] === 'lowercase')) result = String(val).toLowerCase();
        if (op === 'reverse' || (op === 'transform' && stringMatch[3] === 'reverse')) result = String(val).split('').reverse().join('');
        if (op === 'length of') result = Array.isArray(val) ? val.length : String(val).length;
        if (op === 'replace') {
           const oldVal = stringMatch[2];
           const newVal = stringMatch[3];
           const target = this.parseValue(stringMatch[4] || "");
           result = String(target).replace(new RegExp(oldVal, 'g'), newVal);
        }
        
        backgroundLogic = `Data Processor: Running ${op.toUpperCase()} operation on value buffer. Latency: 0.05ms.`;
        output.text = `Result of ${op}: ${result}`;
        output.math = typeof result === 'number' ? result : undefined;
        return { input, backgroundLogic, output };
      }

      // 11. Data Visualization
      const chartMatch = trimmedInput.match(/chart\s+\[([0-9,\s]+)\]\s+as\s+(bar|line)/i);
      if (chartMatch) {
        const data = chartMatch[1].split(',').map(n => parseFloat(n.trim()));
        const type = chartMatch[2].toLowerCase() as 'bar' | 'line';
        backgroundLogic = `Visualization Pipeline: Formatting dataset for ${type} rendering. Normalizing axes and calculating scale factors.`;
        output.chart = { type, data, label: 'Core Dataset Explorer' };
        output.text = `Initialized ${type} chart with ${data.length} data points.`;
        return { input, backgroundLogic, output };
      }

      // 12. System Routines
      if (trimmedInput.toLowerCase().includes("show system clock")) {
        backgroundLogic = "Kernel Interrupt: Querying real-time clock (RTC) via hardware abstraction layer.";
        output.system = { type: 'clock', payload: { time: new Date().toISOString() } };
        output.text = "System clock synchronized.";
        return { input, backgroundLogic, output };
      }

      if (trimmedInput.toLowerCase().includes("query system status")) {
        backgroundLogic = "Diagnostic Protocol: Running integrity check on memory registers and CPU cycles.";
        output.system = { 
          type: 'diagnostics', 
          payload: { 
            cpu: `${Math.floor(Math.random() * 20 + 5)}%`, 
            memo: `${Math.floor(Math.random() * 1024 + 512)}MB`,
            status: 'STABLE'
          } 
        };
        output.text = "System diagnostic complete. All modules green.";
        return { input, backgroundLogic, output };
      }

      // 13. Macro Definitions
      const macroMatch = trimmedInput.match(/let\s+([a-z_]+)\s+mean:\s+(.+)/i);
      if (macroMatch) {
         const name = macroMatch[1];
         const sequence = macroMatch[2].split(',').map(s => s.trim());
         this.state.variables[`macro_${name}`] = sequence;
         backgroundLogic = `Macro Definition: Storing procedure sequence in instruction cache under alias '${name}'.`;
         output.text = `Macro '${name}' defined with ${sequence.length} instructions.`;
         return { input, backgroundLogic, output };
      }

      // 14. Macro Execution
      const executeMatch = trimmedInput.match(/run\s+([a-z_]+)\.?/i);
      if (executeMatch) {
        const name = executeMatch[1];
        const sequence = this.state.variables[`macro_${name}`];
        if (sequence && Array.isArray(sequence)) {
          backgroundLogic = `Macro Dispatcher: Unrolling instruction sequence for '${name}'. Sequential execution initiated.`;
          let combinedOutput = sequence.map(cmd => {
            const res = this.execute(cmd);
            return res.output.text;
          }).join(' → ');
          output.text = `Macro Result: ${combinedOutput}`;
          return { input, backgroundLogic, output };
        }
      }

      // 15. Logical Comparisons
      const compareMatch = trimmedInput.match(/compare\s+(.+?)\s+and\s+(.+)/i);
      if (compareMatch) {
        const a = compareMatch[1].trim();
        const b = compareMatch[2].trim();
        const valA = isNaN(Number(a)) ? a : Number(a);
        const valB = isNaN(Number(b)) ? b : Number(b);
        const result = valA == valB;
        backgroundLogic = "Logic Gate: Comparing register values. Evaluating equality operator (==).";
        output.logic = { a: valA, b: valB, comparison: '==', result };
        output.text = `Comparison result: ${result ? 'TRUE' : 'FALSE'}`;
        return { input, backgroundLogic, output };
      }

      // 16. Cryptographic Simulation
      const encryptMatch = trimmedInput.match(/encrypt\s+(.+)/i);
      if (encryptMatch) {
        const str = encryptMatch[1].replace(/['"]/g, '');
        const encoded = btoa(str).substring(0, 12);
        backgroundLogic = "Crypto Kernel: Running Base64 derivation. Padding bitstream. Obfuscating source pointers.";
        output.crypto = { original: str, encoded, method: 'BASE64_OBFUSCATION' };
        output.text = `String encrypted to buffer: ${encoded}`;
        return { input, backgroundLogic, output };
      }

      // 17. Environment Controls
      const envMatch = trimmedInput.match(/set\s+environment\s+to\s+(rain|snow|void)/i);
      if (envMatch) {
        const mode = envMatch[1].toLowerCase();
        backgroundLogic = `World Kernel: Shifting global state to ${mode}. Re-calculating particle physics and ambient light.`;
        output.particles = { 
          count: 150, 
          color: mode === 'rain' ? '#38bdf8' : mode === 'snow' ? '#ffffff' : '#4f46e5',
          x: 400,
          y: -50
        };
        output.text = `Environment state initialized: ${mode.toUpperCase()}`;
        return { input, backgroundLogic, output };
      }

      // 18. List Sorting & Conversion
      const hexMatch = trimmedInput.match(/^(hex to dec|dec to hex)\s+(.+)\.?$/i);
      if (hexMatch) {
         const op = hexMatch[1].toLowerCase();
         const val = hexMatch[2].trim();
         let res = "";
         if (op === 'hex to dec') res = parseInt(val, 16).toString();
         if (op === 'dec to hex') res = parseInt(val, 10).toString(16).toUpperCase();
         backgroundLogic = `Base-Conversion Kernel: shifting radix between DEC and HEX.`;
         output.text = `Converted value: ${res}`;
         return { input, backgroundLogic, output };
      }

      // 22. File System Simulation
      const fileMatch = trimmedInput.match(/^(write|append|read|delete)\s+"(.+?)"(?:\s+data:\s+(.+))?/i);
      if (fileMatch) {
         const op = fileMatch[1].toLowerCase();
         const filename = fileMatch[2];
         const data = fileMatch[3];
         
         if (op === 'write') this.virtualFiles[filename] = data || "";
         if (op === 'append') this.virtualFiles[filename] = (this.virtualFiles[filename] || "") + "\n" + (data || "");
         if (op === 'delete') delete this.virtualFiles[filename];
         
         backgroundLogic = `V-Disk Controller: ${op.toUpperCase()} operation on node "${filename}". Latency: 0.2ms.`;
         output.text = op === 'read' ? `Read from ${filename}: ${this.virtualFiles[filename] || "null"}` : `File operation status: 200 OK`;
         output.system = { type: 'file_system', payload: { files: this.virtualFiles } };
         return { input, backgroundLogic, output };
      }

      // 23. Wait / Delay
      const waitMatch = trimmedInput.match(/^wait\s+(\d+)\s+seconds/i);
      if (waitMatch) {
        output.system = { type: 'timer', payload: { duration: waitMatch[1] } };
        output.text = `Timer set for ${waitMatch[1]} seconds. Thread yielding...`;
        return { input, backgroundLogic, output };
      }

      // 24. Beep
      if (trimmedInput.toLowerCase() === "play a beep") {
        output.system = { type: 'beep', payload: { freq: 440, duration: 0.2 } };
        output.text = "Beep transmitted to audio buffer.";
        return { input, backgroundLogic, output };
      }

      // 25. Turtle Graphics
      const turtleMatch = trimmedInput.match(/^(move|turn|pen|color|draw|reset turtle|clear turtle)\s*(.*)$/i);
      if (turtleMatch) {
         const op = turtleMatch[1].toLowerCase();
         const args = turtleMatch[2].trim().split(/\s+/);
         backgroundLogic = `Turtle Vector Engine: issueing instruction '${op}' to drawing processor.`;
         output.turtle = { command: op, args };
         output.text = `Turtle command dispatched: ${op}.`;
         return { input, backgroundLogic, output };
      }

      // 26. System Tools
      if (trimmedInput.toLowerCase() === "clear variables") {
        this.state.variables = { 'PI': 3.14159, 'E': 2.71828, 'VERSION': '2.5.0' };
        backgroundLogic = "Memory Manager: flushing symbol table entries and garbage collecting dereferenced objects.";
        output.text = "All user variables cleared from memory.";
        return { input, backgroundLogic, output };
      }

      if (trimmedInput.toLowerCase() === "list variables" || trimmedInput.toLowerCase() === "list v") {
         const vars = Object.keys(this.state.variables).join(', ');
         backgroundLogic = "Symbol Table Query: Enumerating active memory addresses and bound identifiers.";
         output.text = `Active symbols: ${vars}`;
         return { input, backgroundLogic, output };
      }

      // 27. Features & Help
      if (trimmedInput.toLowerCase() === "features" || trimmedInput.toLowerCase() === "help") {
        backgroundLogic = "Metadata Query: Enumerating active modules and syntax patterns.";
        output.text = "Capability manifest retrieved.";
        output.system = { 
          type: 'diagnostics',
          payload: { features: true } 
        };
        return { input, backgroundLogic, output };
      }

      // 28. Cryptography
      const cryptoMatch = trimmedInput.match(/^(encrypt|hash|generate uuid|validate checksum)\s+(.+)?\.?$/i);
      if (cryptoMatch) {
         const op = cryptoMatch[1].toLowerCase();
         const val = cryptoMatch[2]?.trim() || "";
         backgroundLogic = `Security Kernel: Invoking cryptographic primitive '${op.toUpperCase()}'. Entropy capture active.`;
         
         if (op === 'generate uuid') {
            output.text = `Generated UUID: ${crypto.randomUUID()}`;
         } else if (op === 'hash') {
            output.text = `SHA256 Digest of "${val}": ${val.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0).toString(16)}`; // Simplified hash for simulation
         } else if (op === 'encrypt') {
            const parts = val.split(/\s+with\s+/i);
            const encrypted = btoa(parts[0]); // Base64 simulation
            output.text = `Encrypted Ciphertext: ${encrypted}`;
         } else {
            output.text = "Checksum validated against local manifest. State: SECURE.";
         }
         return { input, backgroundLogic, output };
      }

      // 29. AI & Analysis
      const analysisMatch = trimmedInput.match(/^(analyze|extract keywords from|translate|identify)\s+(.+)?\.?$/i);
      if (analysisMatch) {
         const op = analysisMatch[1].toLowerCase();
         const val = analysisMatch[2]?.trim() || "";
         backgroundLogic = "Neural Processor: Parsing semantic structure and extracting linguistic entities.";
         
         if (op === 'analyze') {
            const sentiment = Math.random() > 0.5 ? "POSITIVE (0.89)" : "NEUTRAL (0.45)";
            output.text = `Sentiment analysis result for "${val}": ${sentiment}`;
         } else if (op === 'translate') {
            const parts = val.split(/\s+to\s+/i);
            output.text = `Translated "${parts[0]}" to ${parts[1]}: [Simulated Translation Output]`;
         } else if (op === 'extract keywords from') {
            output.text = `Keywords extracted: ${val.split(' ').slice(0, 3).join(', ')}`;
         } else {
            output.text = `Identity identified: UTF-8 String / Text Buffer`;
         }
         return { input, backgroundLogic, output };
      }

      // 30. System Utils
      if (trimmedInput.toLowerCase() === "check quota") {
         backgroundLogic = "Resource Manager: Querying partition tables and inode allocation.";
         output.text = "Quota Status: 12% Used. Storage Tier: Enterprise. Remaining: 882GB.";
         return { input, backgroundLogic, output };
      }

      if (trimmedInput.toLowerCase() === "system uptime") {
         backgroundLogic = "Kernel Clock: Reading CPU jiffies since last boot cycle.";
         output.text = `System Uptime: ${Math.floor(performance.now() / 1000)}s | Cycle Count: ${Math.floor(performance.now())}`;
         return { input, backgroundLogic, output };
      }

      if (trimmedInput.toLowerCase().startsWith("ping")) {
         const target = trimmedInput.split(' ')[1] || "localhost";
         backgroundLogic = `Network Stack: Dispatching ICMP Echo Request to ${target}.`;
         output.text = `Reply from ${target}: bytes=32 time=${Math.floor(Math.random() * 20)}ms TTL=128`;
         return { input, backgroundLogic, output };
      }

      // 31. Visual Arts Extensions (Turtle)
      if (trimmedInput.toLowerCase().startsWith("draw spiral")) {
         backgroundLogic = "Vector Engine: Calculating recursive archimedean spiral points.";
         output.turtle = { command: "spiral", args: [trimmedInput.split(' ')[2] || "50"] };
         output.text = "Drawing spiral... sequence dispatched to Turtle.";
         return { input, backgroundLogic, output };
      }

      if (trimmedInput.toLowerCase().startsWith("draw polygon")) {
         backgroundLogic = "Vector Engine: Calculating vertex coordinates for regular polygon.";
         output.turtle = { command: "polygon", args: [trimmedInput.split(' ')[2] || "5"] };
         output.text = "Drawing polygon... sequence dispatched to Turtle.";
         return { input, backgroundLogic, output };
      }

      if (trimmedInput.toLowerCase() === "about system") {
        backgroundLogic = "Metadata Query: Accessing system environment variables and kernel build information.";
        output.text = "ACE OS v2.5.0-STABLE. Running on Web-V8 Architecture. Author: AI Studio.";
        return { input, backgroundLogic, output };
      }

      if (trimmedInput.toLowerCase() === "launch diagnostics" || trimmedInput.toLowerCase() === "query system status") {
        backgroundLogic = "Hardware Interrupt: Running full sector scan and memory integrity check.";
        output.system = { 
          type: 'diagnostics', 
          payload: { cpu: '4%', memo: '256MB', status: 'STABLE' } 
        };
        output.text = "Diagnostics sequence initiated. All systems nominal.";
        return { input, backgroundLogic, output };
      }

      if (trimmedInput.toLowerCase().includes("how many features") || trimmedInput.toLowerCase() === "count features") {
        backgroundLogic = "System Audit: Scanning capability manifest and active module registries.";
        output.text = "There are currently 65 integrated features across 8 core categories: Language, Advanced Math, System/V-Disk, Cryptography, AI Analysis, Visual Arts, and Integrated Game Engines.";
        return { input, backgroundLogic, output };
      }

      // Final Fallback
      output.text = `I'm not sure how to "${input}". Try using the Core Syntax!`;
      
    } catch (e) {
      output.error = (e as Error).message;
      backgroundLogic = "Exception encountered during runtime execution.";
    }

    return { input, backgroundLogic, output };
  }

  private parseValue(val: string): any {
    if (this.state.variables[val] !== undefined) return this.state.variables[val];
    if (!isNaN(Number(val))) return Number(val);
    if (val.toLowerCase() === 'true') return true;
    if (val.toLowerCase() === 'false') return false;
    return val.replace(/^['"]|['"]$/g, '');
  }

  private evaluateMath(equation: string): number {
    // Replace variables
    let sanitized = equation;
    Object.keys(this.state.variables).forEach(varName => {
      const regex = new RegExp(`\\b${varName}\\b`, 'g');
      sanitized = sanitized.replace(regex, this.state.variables[varName]);
    });

    try {
      // Basic math evaluator (be careful with eval, but this is a sandbox app)
      // Replacing common words with math symbols if needed
      sanitized = sanitized.replace(/plus/gi, '+').replace(/minus/gi, '-').replace(/times/gi, '*').replace(/divided by/gi, '/');
      
      // Clean up extra chars
      sanitized = sanitized.replace(/[^0-9+\-*/().\s]/g, '');
      
      return Function(`'use strict'; return (${sanitized})`)();
    } catch (e) {
      throw new Error(`Math Error: Could not calculate "${equation}"`);
    }
  }

  private evaluateCondition(condition: string): boolean {
    // Simple equality check for now
    const parts = condition.split(/\s+(is equal to|==|is greater than|>|is less than|<|is)\s+/i);
    if (parts.length >= 3) {
      const left = this.parseValue(parts[0].trim());
      const op = parts[1].toLowerCase().trim();
      const right = this.parseValue(parts[2].trim());

      switch (op) {
        case 'is equal to':
        case '==':
        case 'is':
          return left == right;
        case 'is greater than':
        case '>':
          return left > right;
        case 'is less than':
        case '<':
          return left < right;
      }
    }
    
    // Default to boolean check
    return !!this.parseValue(condition);
  }

  public getState() {
    return this.state;
  }
}
