<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Todo;
use App\Models\User;

class TodoController extends Controller
{
    /**
     * Get the authenticated user's todos relationship
     */
    private function userTodos()
    {
        /** @var User $user */
        $user = Auth::user();
        return $user->todos();
    }

    public function index()
    {
        return $this->userTodos()
            ->whereNull('assigned_to_id')
            ->get();
    }

    public function store(Request $request)
    {

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'string|in:start,inprogress,completed',
            'assigned_to_id' => 'nullable|exists:users,id',
        ]);

        return $this->userTodos()->create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'assigned_to_id' => $request->assigned_to_id,
        ]);
    }

    public function show($id)
    {
        return $this->userTodos()->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $todo = Todo::where(function ($query) use ($user) {
            $query->where('user_id', $user->id)
                ->orWhere('assigned_to_id', $user->id);
        })->findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'string|in:start,inprogress,completed',
        ]);

        $todo->update($request->all());

        return $todo;
    }

    public function destroy($id)
    {
        $todo = $this->userTodos()->findOrFail($id);
        $todo->delete();

        return response()->noContent();
    }

    /**
     * Get todos assigned to the authenticated user
     */
    public function assignedToMe()
    {

        $user = Auth::user();
        $assignedTodos = Todo::where('assigned_to_id', $user->id)
            ->with(['assignedByUser' => function ($query) {
                $query->select('id', 'name');
            }])
            ->get()
            ->map(function ($todo) {
                return [
                    'id' => $todo->id,
                    'title' => $todo->title,
                    'description' => $todo->description,
                    'status' => $todo->status,
                    'assigned_by' => $todo->assignedByUser ? $todo->assignedByUser->name : 'Unknown',
                    'created_at' => $todo->created_at,
                    'updated_at' => $todo->updated_at
                ];
            });

        return response()->json($assignedTodos);
    }

    /**
     * Get todos that the authenticated user has assigned to others
     */
    public function assignedByMe()
    {
        $user = Auth::user();
        $assignedTodos = Todo::where('user_id', $user->id)
            ->whereNotNull('assigned_to_id')
            ->with(['assignedUser' => function ($query) {
                $query->select('id', 'name');
            }])
            ->get()
            ->map(function ($todo) {
                return [
                    'id' => $todo->id,
                    'title' => $todo->title,
                    'description' => $todo->description,
                    'status' => $todo->status,
                    'assigned_to' => $todo->assignedUser ? $todo->assignedUser : null,
                    'created_at' => $todo->created_at,
                    'updated_at' => $todo->updated_at
                ];
            });

        return response()->json($assignedTodos);
    }
}
