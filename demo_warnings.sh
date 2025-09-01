#!/bin/bash

# Demo script for the Warning System
# This script demonstrates various warning scenarios

echo "🚀 Starting Warning System Demo..."
echo ""

# Function to wait for user input
wait_for_user() {
    echo ""
    echo "Press Enter to continue..."
    read -r
}

# Function to clear screen and show demo
clear_and_show() {
    clear
    echo "🎭 WARNING SYSTEM DEMO - $1"
    echo "=================================================="
    echo ""
}

# Demo 1: Phone Detection with Countdown
clear_and_show "Phone Detection - Initial Detection"
./warning_system.sh phone 0 10
wait_for_user

# Demo 2: First Warning
clear_and_show "Phone Detection - First Warning"
./warning_system.sh phone 1
wait_for_user

# Demo 3: Second Warning
clear_and_show "Phone Detection - Second Warning"
./warning_system.sh phone 2
wait_for_user

# Demo 4: Third Warning
clear_and_show "Phone Detection - Third Warning"
./warning_system.sh phone 3
wait_for_user

# Demo 5: Final Warning
clear_and_show "Phone Detection - Final Warning"
./warning_system.sh phone 4
wait_for_user

# Demo 6: Performance Monitoring
clear_and_show "Performance Monitoring - Good Scores"
./warning_system.sh performance 85 78 92
wait_for_user

# Demo 7: Performance Monitoring - Needs Improvement
clear_and_show "Performance Monitoring - Needs Improvement"
./warning_system.sh performance 65 58 72
wait_for_user

# Demo 8: System Status
clear_and_show "System Status"
./warning_system.sh status
wait_for_user

# Demo 9: Live Countdown Simulation
clear_and_show "Live Countdown Simulation"
echo "Simulating live countdown from 10 to 1..."
echo ""

for i in {10..1}; do
    clear
    echo "🎭 WARNING SYSTEM DEMO - Live Countdown"
    echo "=================================================="
    echo ""
    ./warning_system.sh phone 0 $i
    sleep 1
done

# Demo 10: Final Demo
clear_and_show "Demo Complete"
echo "🎉 Warning System Demo Complete!"
echo ""
echo "You can now use the warning system with:"
echo "  ./warning_system.sh phone [warning_count] [countdown]"
echo "  ./warning_system.sh performance [confidence] [engagement] [attentiveness]"
echo "  ./warning_system.sh status"
echo "  ./warning_system.sh help"
echo ""
echo "Examples:"
echo "  ./warning_system.sh phone 0 5    # Phone detected, 5s countdown"
echo "  ./warning_system.sh phone 2      # Phone warning 2/4"
echo "  ./warning_system.sh performance 90 85 88  # High performance scores"
echo ""
echo "Thank you for trying the Warning System! 🚀"

