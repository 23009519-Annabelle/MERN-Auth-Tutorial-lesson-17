import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
    import { useAuthContext } from "../hooks/useAuthContext";
    import WorkoutDetails from "../components/WorkoutDetails";
    import WorkoutForm from "../components/WorkoutForm";
    import { useEffect } from 'react';

    const Home = () => {
      const { workouts, dispatch } = useWorkoutsContext();
      const { user } = useAuthContext();

      // Get the correct API base URL from environment variable.
      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000'; // Replace this with your backend base url and fallback to localhost for local development.

      useEffect(() => {
        const fetchWorkouts = async () => {
          if (!user || !user.token) return; // Early return if user or token is missing
          try {
            const response = await fetch(`${API_BASE_URL}/api/workouts`, { // Use the full API URL here.
              headers: { Authorization: `Bearer ${user.token}` },
            });

            if (!response.ok) {
                const message = `An error has occured: ${response.status}`;
                throw new Error(message);
              }
            const json = await response.json();

            dispatch({ type: "SET_WORKOUTS", payload: json });
          } catch(error) {
            console.error(error)
            //handle error
          }
        };

        if (user) {
          fetchWorkouts();
        }
      }, [dispatch, user, API_BASE_URL]); // add the variable as dependency of useEffect

      return (
        <div className="home">
          <div className="workouts">
            {workouts &&
              workouts.map((workout) => (
                <WorkoutDetails key={workout._id} workout={workout} />
              ))}
          </div>
          <WorkoutForm />
        </div>
      );
    };

    export default Home;