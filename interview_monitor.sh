#!/bin/bash

# Interview Monitor Script
# Integrates with the warning system to provide real-time monitoring

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Configuration
WARNING_INTERVAL=10  # Seconds between warnings
MAX_WARNINGS=4       # Maximum warnings before termination
COUNTDOWN_START=10   # Initial countdown seconds

# State variables
phone_detected=false
warning_count=0
last_warning_time=0
countdown_active=false

# Function to display colored text
print_color() {
    local color=$1
    local text=$2
    echo -e "${color}${text}${NC}"
}

# Function to clear screen and show header
show_header() {
    clear
    echo "=================================================="
    print_color $CYAN "🎭 INTERVIEW MONITORING SYSTEM"
    echo "=================================================="
    echo ""
}

# Function to show phone detection status
show_phone_status() {
    local current_time=$(date +%s)
    
    if [ "$phone_detected" = true ]; then
        if [ $warning_count -eq 0 ]; then
            if [ "$countdown_active" = true ]; then
                local remaining=$((COUNTDOWN_START - (current_time - last_warning_time)))
                if [ $remaining -gt 0 ]; then
                    print_color $YELLOW "📱 Phone Detected - Warning in ${remaining} seconds"
                    ./warning_system.sh phone 0 $remaining
                else
                    # Time to issue first warning
                    warning_count=1
                    last_warning_time=$current_time
                    countdown_active=false
                    print_color $ORANGE "⚠️  First Warning Issued (1/4)"
                    ./warning_system.sh phone 1
                fi
            else
                # Start countdown
                countdown_active=true
                last_warning_time=$current_time
                print_color $YELLOW "📱 Phone Detected - Starting ${COUNTDOWN_START}s countdown"
                ./warning_system.sh phone 0 $COUNTDOWN_START
            fi
        else
            # Check if enough time has passed for next warning
            local time_since_last=$((current_time - last_warning_time))
            if [ $time_since_last -ge $WARNING_INTERVAL ] && [ $warning_count -lt $MAX_WARNINGS ]; then
                warning_count=$((warning_count + 1))
                last_warning_time=$current_time
                
                if [ $warning_count -ge $MAX_WARNINGS ]; then
                    print_color $RED "💥 FINAL WARNING - Interview Terminated!"
                    ./warning_system.sh phone $MAX_WARNINGS
                    echo ""
                    print_color $RED "Interview has been terminated due to repeated phone violations."
                    exit 1
                else
                    print_color $RED "⚠️  Warning ${warning_count}/${MAX_WARNINGS} Issued"
                    ./warning_system.sh phone $warning_count
                fi
            else
                local remaining=$((WARNING_INTERVAL - time_since_last))
                print_color $RED "📱 Phone Still Detected - Warning ${warning_count}/${MAX_WARNINGS}"
                print_color $YELLOW "Next warning in ${remaining} seconds"
            fi
        fi
    else
        if [ $warning_count -gt 0 ]; then
            print_color $GREEN "✅ Phone Removed - Warnings Reset"
            warning_count=0
            countdown_active=false
        fi
        print_color $GREEN "✅ No Phone Detected - System Normal"
    fi
}

# Function to show performance summary
show_performance_summary() {
    echo ""
    echo "=================================================="
    print_color $CYAN "📊 Performance Summary"
    echo "=================================================="
    
    # Simulate performance scores (in real system, these would come from the interview app)
    local confidence=$((70 + RANDOM % 30))  # 70-99
    local engagement=$((65 + RANDOM % 35))  # 65-99
    local attentiveness=$((75 + RANDOM % 25))  # 75-99
    
    print_color $WHITE "Confidence: ${confidence}%"
    print_color $WHITE "Engagement: ${engagement}%"
    print_color $WHITE "Attentiveness: ${attentiveness}%"
    
    local overall=$(((confidence + engagement + attentiveness) / 3))
    print_color $CYAN "Overall: ${overall}%"
    
    if [ $overall -ge 80 ]; then
        print_color $GREEN "🎉 Excellent Performance!"
    elif [ $overall -ge 70 ]; then
        print_color $YELLOW "👍 Good Performance"
    else
        print_color $RED "⚠️  Needs Improvement"
    fi
}

# Function to show system status
show_system_status() {
    echo ""
    echo "=================================================="
    print_color $CYAN "🖥️  System Status"
    echo "=================================================="
    
    print_color $GREEN "📹 Camera: Active"
    print_color $GREEN "🎯 Object Detection: Running"
    print_color $GREEN "😊 Emotion Detection: Active"
    print_color $GREEN "👁️  Behavior Analysis: Running"
    print_color $GREEN "🤖 AI Avatar: Ready"
    print_color $GREEN "📊 Performance Monitoring: Active"
    
    echo ""
    print_color $WHITE "Time: $(date '+%H:%M:%S')"
    print_color $WHITE "Phone Warnings: ${warning_count}/${MAX_WARNINGS}"
    
    if [ "$phone_detected" = true ]; then
        print_color $RED "Status: Phone Detection Active"
    else
        print_color $GREEN "Status: Normal Operation"
    fi
}

# Function to handle user input
handle_user_input() {
    echo ""
    echo "=================================================="
    print_color $CYAN "🎮 Controls"
    echo "=================================================="
    print_color $WHITE "Press 'p' to toggle phone detection"
    print_color $WHITE "Press 'w' to show warning system"
    print_color $WHITE "Press 's' to show system status"
    print_color $WHITE "Press 'q' to quit"
    echo ""
    print_color $YELLOW "Waiting for input..."
    
    read -t 5 -n 1 key
    case $key in
        p|P)
            phone_detected=$([ "$phone_detected" = true ] && echo false || echo true)
            if [ "$phone_detected" = true ]; then
                print_color $YELLOW "📱 Phone Detection: ENABLED"
            else
                print_color $GREEN "📱 Phone Detection: DISABLED"
            fi
            ;;
        w|W)
            ./warning_system.sh phone $warning_count
            ;;
        s|S)
            ./warning_system.sh status
            ;;
        q|Q)
            print_color $CYAN "👋 Shutting down interview monitor..."
            exit 0
            ;;
    esac
}

# Function to simulate phone detection events
simulate_phone_events() {
    # Simulate random phone detection events
    if [ $((RANDOM % 100)) -lt 5 ]; then  # 5% chance each cycle
        phone_detected=true
        print_color $YELLOW "📱 Phone Detection Event Simulated"
    elif [ $((RANDOM % 100)) -lt 10 ]; then  # 10% chance each cycle
        phone_detected=false
        print_color $GREEN "📱 Phone Removal Event Simulated"
    fi
}

# Main monitoring loop
main() {
    show_header
    print_color $GREEN "🚀 Interview Monitor Started"
    print_color $CYAN "Press 'p' to toggle phone detection simulation"
    echo ""
    
    while true; do
        show_header
        
        # Show current status
        show_phone_status
        show_performance_summary
        show_system_status
        
        # Handle user input
        handle_user_input
        
        # Simulate events (optional)
        simulate_phone_events
        
        # Wait before next update
        sleep 2
    done
}

# Show help if requested
if [ "$1" = "help" ] || [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Interview Monitor Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  help, --help, -h    Show this help message"
    echo "  start               Start monitoring (default)"
    echo ""
    echo "Controls:"
    echo "  p                   Toggle phone detection simulation"
    echo "  w                   Show warning system"
    echo "  s                   Show system status"
    echo "  q                   Quit"
    echo ""
    echo "Example:"
    echo "  $0 start            # Start monitoring"
    exit 0
fi

# Start monitoring
main

