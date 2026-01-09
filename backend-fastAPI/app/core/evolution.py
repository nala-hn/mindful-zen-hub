def check_avatar_evolution(total_completed: int) -> str:
    """
    Menentukan status avatar berdasarkan jumlah habit yang diselesaikan.
    Sesuai rencana Dynamic Avatar.
    """
    if total_completed >= 50:
        return "Zen Master"
    elif total_completed >= 20:
        return "Adult Zen"
    elif total_completed >= 5:
        return "Baby Zen"
    else:
        return "Egg"