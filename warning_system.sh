#!/bin/bash

# Warning System Script
# A comprehensive bash script for displaying warnings and notifications

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
ORANGE='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Warning levels
WARNING_LOW=1
WARNING_MEDIUM=2
WARNING_HIGH=3
WARNING_CRITICAL=4

# Function to display colored text
print_color() {
    local color=$1
    local text=$2
    echo -e "${color}${text}${NC}"
}

# Function to display warning header
show_warning_header() {
    local level=$1
    local title=$2
    
    case $level in
        $WARNING_LOW)
            print_color $YELLOW "⚠️  WARNING (LOW): $title"
            ;;
        $WARNING_MEDIUM)
            print_color $ORANGE "⚠️  WARNING (MEDIUM): $title"
            ;;
        $WARNING_HIGH)
            print_color $RED "🚨 WARNING (HIGH): $title"
            ;;
        $WARNING_CRITICAL)
            print_color $RED "💥 CRITICAL WARNING: $title"
            ;;
    esac
}

# Function to display phone detection warning
phone_detection_warning() {
    local warning_count=$1
    local countdown=$2
    
    clear
    echo "=================================================="
    print_color $CYAN "📱 PHONE DETECTION WARNING SYSTEM"
    echo "=================================================="
    echo ""
    
    if [ $warning_count -eq 0 ]; then
        if [ ! -z "$countdown" ]; then
            show_warning_header $WARNING_LOW "Phone Detected - Warning in ${countdown} seconds"
            print_color $YELLOW "A phone has been detected in the interview frame."
            print_color $YELLOW "Please remove the phone to avoid warnings."
            echo ""
            print_color $CYAN "⏰ Countdown: ${countdown} seconds until first warning"
        else
            show_warning_header $WARNING_LOW "Phone Detected - Preparing Warning"
            print_color $YELLOW "A phone has been detected in the interview frame."
            print_color $YELLOW "Please remove the phone to avoid warnings."
        fi
    else
        case $warning_count in
            1)
                show_warning_header $WARNING_MEDIUM "Phone Warning 1/4"
                print_color $ORANGE "First warning issued. Please remove your phone."
                ;;
            2)
                show_warning_header $WARNING_HIGH "Phone Warning 2/4"
                print_color $RED "Second warning issued. Phone still detected."
                ;;
            3)
                show_warning_header $WARNING_HIGH "Phone Warning 3/4"
                print_color $RED "Third warning issued. This is serious."
                ;;
            4)
                show_warning_header $WARNING_CRITICAL "Phone Warning 4/4 - FINAL"
                print_color $RED "Final warning! Interview will be terminated."
                ;;
        esac
    fi
    
    echo ""
    echo "=================================================="
    print_color $WHITE "Status: Phone Detection Active"
    print_color $WHITE "Time: $(date '+%H:%M:%S')"
    echo "=================================================="
}

# Function to display interview performance
show_performance() {
    local confidence=$1
    local engagement=$2
    local attentiveness=$3
    
    clear
    echo "=================================================="
    print_color $CYAN "📊 INTERVIEW PERFORMANCE MONITORING"
    echo "=================================================="
    echo ""
    
    # Confidence Score
    print_color $BLUE "Confidence: ${confidence}%"
    print_progress_bar $confidence $BLUE
    echo ""
    
    # Engagement Score
    print_color $GREEN "Engagement: ${engagement}%"
    print_progress_bar $engagement $GREEN
    echo ""
    
    # Attentiveness Score
    print_color $PURPLE "Attentiveness: ${attentiveness}%"
    print_progress_bar $attentiveness $PURPLE
    echo ""
    
    # Overall Performance Status
    local overall_score=$(( (confidence + engagement + attentiveness) / 3 ))
    echo ""
    print_color $CYAN "Overall Performance: ${overall_score}%"
    
    if [ $overall_score -ge 80 ]; then
        print_color $GREEN "🎉 Excellent Performance!"
    elif [ $overall_score -ge 70 ]; then
        print_color $YELLOW "👍 Good Performance"
    else
        print_color $RED "⚠️  Needs Improvement"
    fi
    
    echo ""
    echo "=================================================="
    print_color $WHITE "Time: $(date '+%H:%M:%S')"
    echo "=================================================="
}

# Function to print progress bar
print_progress_bar() {
    local percentage=$1
    local color=$2
    local width=30
    local filled=$((percentage * width / 100))
    local empty=$((width - filled))
    
    printf "  ["
    for ((i=0; i<filled; i++)); do
        printf "█"
    done
    for ((i=0; i<empty; i++)); do
        printf "░"
    done
    printf "] ${percentage}%%\n"
}

# Function to display system status
show_system_status() {
    clear
    echo "=================================================="
    print_color $CYAN "🖥️  INTERVIEW SYSTEM STATUS"
    echo "=================================================="
    echo ""
    
    # Camera Status
    print_color $GREEN "📹 Camera: Active"
    print_color $GREEN "🎯 Object Detection: Running"
    print_color $GREEN "😊 Emotion Detection: Active"
    print_color $GREEN "👁️  Behavior Analysis: Running"
    echo ""
    
    # AI Avatar Status
    print_color $BLUE "🤖 AI Avatar: Ready"
    print_color $BLUE "🗣️  Lip-sync: Active"
    print_color $BLUE "🎭 Morph Targets: Loaded"
    echo ""
    
    # Performance Monitoring
    print_color $PURPLE "📊 Live Performance: Active"
    print_color $PURPLE "⚡ Real-time Updates: Enabled"
    echo ""
    
    echo "=================================================="
    print_color $WHITE "System Time: $(date)"
    print_color $WHITE "Uptime: $(uptime -p)"
    echo "=================================================="
}

# Function to display help
show_help() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  phone [count] [countdown]  - Show phone detection warning"
    echo "  performance [c] [e] [a]    - Show performance metrics"
    echo "  status                     - Show system status"
    echo "  help                       - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 phone 0 10              - Phone detected, 10s countdown"
    echo "  $0 phone 2                 - Phone warning 2/4"
    echo "  $0 performance 85 72 90   - Show performance with scores"
    echo "  $0 status                  - Show system status"
}

# Function to play warning sound (if available)
play_warning_sound() {
    local level=$1
    
    # Try to play different sounds based on warning level
    case $level in
        $WARNING_LOW|$WARNING_MEDIUM)
            # Try to play a gentle beep
            if command -v beep >/dev/null 2>&1; then
                beep -f 800 -l 200
            elif command -v paplay >/dev/null 2>&1; then
                paplay /usr/share/sounds/freedesktop/stereo/message.oga 2>/dev/null || true
            fi
            ;;
        $WARNING_HIGH|$WARNING_CRITICAL)
            # Try to play a more urgent sound
            if command -v beep >/dev/null 2>&1; then
                beep -f 400 -l 100 -r 3
            elif command -v paplay >/dev/null 2>&1; then
                paplay /usr/share/sounds/freedesktop/stereo/dialog-warning.oga 2>/dev/null || true
            fi
            ;;
    esac
}

# Main script logic
main() {
    case "${1:-help}" in
        "phone")
            local warning_count=${2:-0}
            local countdown=${3:-""}
            phone_detection_warning $warning_count $countdown
            play_warning_sound $WARNING_MEDIUM
            ;;
        "performance")
            local confidence=${2:-85}
            local engagement=${3:-72}
            local attentiveness=${4:-90}
            show_performance $confidence $engagement $attentiveness
            ;;
        "status")
            show_system_status
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function with all arguments
main "$@"

