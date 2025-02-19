import { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

function WorkoutDetails({ workout }) {
    const { dispatch } = useWorkoutsContext();
    const { user } = useAuthContext();
    const [isEditing, setIsEditing] = useState(false);
    const [updatedWorkout, setUpdatedWorkout] = useState({
        title: workout.title,
        load: workout.load,
        reps: workout.reps,
    });

    const handleDelete = async () => {
        if (!user) return;

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${user.token}` },
        });

        if (response.ok) {
            const json = await response.json();
            dispatch({ type: "DELETE_WORKOUT", payload: json });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/${workout._id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(updatedWorkout),
        });

        if (response.ok) {
            const json = await response.json();
            dispatch({ type: "UPDATE_WORKOUT", payload: json });
            setIsEditing(false);
        }
    };

    return (
        <div className="workout-details">
            {isEditing ? (
                <form onSubmit={handleUpdate}>
                    <input type="text" value={updatedWorkout.title} onChange={(e) => setUpdatedWorkout({ ...updatedWorkout, title: e.target.value })} />
                    <input type="number" value={updatedWorkout.load} onChange={(e) => setUpdatedWorkout({ ...updatedWorkout, load: e.target.value })} />
                    <input type="number" value={updatedWorkout.reps} onChange={(e) => setUpdatedWorkout({ ...updatedWorkout, reps: e.target.value })} />
                    <button type="submit">Update</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            ) : (
                <>
                    <h4>{workout.title}</h4>
                    <p><strong>Load (kg):</strong> {workout.load}</p>
                    <p><strong>Reps:</strong> {workout.reps}</p>
                    
                    {/* Updated buttons */}
                    <div className="action-buttons">
                        <span className="material-symbols-outlined delete-btn" onClick={handleDelete}>delete</span>
                        <span className="material-symbols-outlined edit-btn" onClick={() => setIsEditing(true)}>edit</span>
                    </div>
                </>
            )}
        </div>
    );
}

export default WorkoutDetails;
