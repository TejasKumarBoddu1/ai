#!/bin/bash

# Show All Commands Script
# Displays all available warning system commands and their usage

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Function to display colored text
print_color() {
    local color=$1
    local text=$2
    echo -e "${color}${text}${NC}"
}

# Function to display section header
show_section() {
    local title=$1
    echo ""
    echo "=================================================="
    print_color $CYAN "🔧 $title"
    echo "=================================================="
    echo ""
}

# Function to display command with description
show_command() {
    local command=$1
    local description=$2
    local example=$3
    
    print_color $WHITE "Command: $command"
    print_color $YELLOW "Description: $description"
    if [ ! -z "$example" ]; then
        print_color $GREEN "Example: $example"
    fi
    echo ""
}

# Main display function
main() {
    clear
    echo "=================================================="
    print_color $CYAN "🚨 WARNING SYSTEM - ALL AVAILABLE COMMANDS"
    echo "=================================================="
    echo ""
    print_color $WHITE "This system provides comprehensive warning and monitoring capabilities"
    print_color $WHITE "for interview systems with phone detection and performance tracking."
    echo ""
    
    # Available Scripts
    show_section "AVAILABLE SCRIPTS"
    
    print_color $GREEN "📁 warning_system.sh"
    print_color $WHITE "Main warning system with phone detection and performance monitoring"
    echo ""
    
    print_color $GREEN "📁 demo_warnings.sh"
    print_color $WHITE "Interactive demo showcasing all warning scenarios"
    echo ""
    
    print_color $GREEN "📁 interview_monitor.sh"
    print_color $WHITE "Real-time monitoring with simulation capabilities"
    echo ""
    
    print_color $GREEN "📁 show_all_commands.sh"
    print_color $WHITE "This help script - shows all available commands"
    echo ""
    
    # Warning System Commands
    show_section "WARNING SYSTEM COMMANDS"
    
    show_command "./warning_system.sh phone [count] [countdown]" \
        "Show phone detection warning with specified level and countdown" \
        "./warning_system.sh phone 0 10"
    
    show_command "./warning_system.sh performance [c] [e] [a]" \
        "Display performance metrics with confidence, engagement, and attentiveness scores" \
        "./warning_system.sh performance 85 72 90"
    
    show_command "./warning_system.sh status" \
        "Show comprehensive system status and health information" \
        "./warning_system.sh status"
    
    show_command "./warning_system.sh help" \
        "Display help information and usage examples" \
        "./warning_system.sh help"
    
    # Demo Commands
    show_section "DEMO COMMANDS"
    
    show_command "./demo_warnings.sh" \
        "Run interactive demo showing all warning scenarios" \
        "./demo_warnings.sh"
    
    # Monitor Commands
    show_section "MONITORING COMMANDS"
    
    show_command "./interview_monitor.sh" \
        "Start real-time monitoring with phone detection simulation" \
        "./interview_monitor.sh"
    
    show_command "./interview_monitor.sh help" \
        "Show help for the interview monitor" \
        "./interview_monitor.sh help"
    
    # Phone Detection Scenarios
    show_section "PHONE DETECTION SCENARIOS"
    
    print_color $WHITE "📱 Phone Detection Flow:"
    echo "  1. Phone detected → 10s countdown → Warning 1/4"
    echo "  2. Still detected → 4s wait → Warning 2/4"
    echo "  3. Still detected → 4s wait → Warning 3/4"
    echo "  4. Still detected → 4s wait → Warning 4/4 → Interview Terminated"
    echo ""
    
    print_color $WHITE "🎯 Warning Levels:"
    print_color $YELLOW "  Level 0: Phone detected, countdown active"
    print_color $ORANGE "  Level 1: First warning issued"
    print_color $RED "  Level 2: Second warning issued"
    print_color $RED "  Level 3: Third warning issued"
    print_color $RED "  Level 4: Final warning - Interview terminated"
    echo ""
    
    # Performance Monitoring
    show_section "PERFORMANCE MONITORING"
    
    print_color $WHITE "📊 Performance Metrics:"
    print_color $BLUE "  Confidence Score: Blue progress bar"
    print_color $GREEN "  Engagement Score: Green progress bar"
    print_color $PURPLE "  Attentiveness Score: Purple progress bar"
    echo ""
    
    print_color $WHITE "🏆 Performance Levels:"
    print_color $GREEN "  Excellent: 80%+ overall score"
    print_color $YELLOW "  Good: 70-79% overall score"
    print_color $RED "  Needs Improvement: <70% overall score"
    echo ""
    
    # Quick Start Guide
    show_section "🚀 QUICK START GUIDE"
    
    print_color $WHITE "1. Make scripts executable:"
    print_color $GREEN "   chmod +x *.sh"
    echo ""
    
    print_color $WHITE "2. Run the demo:"
    print_color $GREEN "   ./demo_warnings.sh"
    echo ""
    
    print_color $WHITE "3. Test individual commands:"
    print_color $GREEN "   ./warning_system.sh phone 0 5"
    print_color $GREEN "   ./warning_system.sh performance 90 85 88"
    print_color $GREEN "   ./warning_system.sh status"
    echo ""
    
    print_color $WHITE "4. Start real-time monitoring:"
    print_color $GREEN "   ./interview_monitor.sh"
    echo ""
    
    # Integration Examples
    show_section "🔗 INTEGRATION EXAMPLES"
    
    print_color $WHITE "📱 Phone Detection Integration:"
    print_color $GREEN "  # In your interview app, call:"
    print_color $WHITE "  ./warning_system.sh phone 0 10  # Phone detected"
    print_color $WHITE "  ./warning_system.sh phone 1      # First warning"
    print_color $WHITE "  ./warning_system.sh phone 2      # Second warning"
    echo ""
    
    print_color $WHITE "📊 Performance Integration:"
    print_color $GREEN "  # Update performance scores:"
    print_color $WHITE "  ./warning_system.sh performance \$confidence \$engagement \$attentiveness"
    echo ""
    
    # Troubleshooting
    show_section "🔍 TROUBLESHOOTING"
    
    print_color $WHITE "Common Issues:"
    print_color $YELLOW "  • Colors not displaying: Check terminal ANSI support"
    print_color $YELLOW "  • Permission denied: Run chmod +x *.sh"
    print_color $YELLOW "  • Audio not working: Install beep package"
    echo ""
    
    print_color $WHITE "Debug Mode:"
    print_color $GREEN "  # Add debug logging to scripts"
    print_color $WHITE "  echo \"DEBUG: \$variable\" >&2"
    echo ""
    
    # Final Notes
    show_section "📝 FINAL NOTES"
    
    print_color $WHITE "✨ This warning system provides:"
    echo "  • Professional warning displays"
    echo "  • Real-time monitoring capabilities"
    echo "  • Performance tracking"
    echo "  • Easy integration with existing systems"
    echo "  • Comprehensive documentation"
    echo ""
    
    print_color $GREEN "🎯 Perfect for:"
    echo "  • Interview monitoring systems"
    echo "  • Security applications"
    echo "  • Performance tracking"
    echo "  • System administration"
    echo "  • Educational purposes"
    echo ""
    
    echo "=================================================="
    print_color $CYAN "🚨 Ready to implement warnings! 🚨"
    echo "=================================================="
    echo ""
    print_color $WHITE "For more information, check the README_WARNING_SYSTEM.md file"
    print_color $WHITE "or run any script with the 'help' option."
    echo ""
}

# Show help if requested
if [ "$1" = "help" ] || [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Show All Commands Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  help, --help, -h    Show this help message"
    echo "  show                Show all commands (default)"
    echo ""
    echo "This script displays all available warning system commands"
    echo "and provides comprehensive usage information."
    exit 0
fi

# Run main function
main

