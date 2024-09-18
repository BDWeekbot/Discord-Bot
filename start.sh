# Create the start.sh file in your project root
echo '#!/bin/bash' > start.sh
echo 'litefs mount &' >> start.sh
echo 'sleep 5' >> start.sh
echo './main' >> start.sh

# Make the script executable
chmod +x start.sh