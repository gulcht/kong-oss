for file in credentials/*.yaml; do
  kubectl apply -f $file 
done

for file in consumer/*.yaml; do
  kubectl apply -f $file 
done

for file in plugin/*.yaml; do
  kubectl apply -f $file 
done

for service in "services"/*; do
  if [ -d "$service" ]; then
    echo "Applying files in folder: $service"
    
    # Apply all YAML files in the folder
    for yaml_file in "$service"/*.yaml; do
      if [ -f "$yaml_file" ]; then
        kubectl apply -f "$yaml_file" 
      fi
    done
  fi
done
