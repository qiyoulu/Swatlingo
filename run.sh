#!/bin/zsh

# Function to cleanup and exit
cleanup() {
	echo " run.sh: cleaning up processes..."
	kill -TERM "$sass_pid" "$python_pid" 2>/dev/null
	exit 0
}

# Trap interrupt signal (Ctrl+C) and execute cleanup function
trap cleanup INT

# Function to detect all Sass files in the 'static' directory
detect_sass_files() {
	sass_files=($(find static -type f -name '*.sass'))
}

# Run the detection function
detect_sass_files

# Run Sass on all detected Sass files
for sass_file in "${sass_files[@]}"; do
	css_file="${sass_file%.sass}.css"
	sass "$sass_file" "$css_file" --watch &
	sass_pids+=($!)
done

source .venv/bin/activate
python app.py &
python_pid=$!

# Wait for background processes to finish
wait "${sass_pids[@]}" $python_pid
