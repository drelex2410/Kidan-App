<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Upload extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'file_original_name', 'file_name', 'user_id', 'extension', 'type', 'file_size',
    ];

    protected $appends = [
        'preview_url',
        'download_url',
        'is_previewable',
        'display_name',
        'file_icon_class',
        'normalized_file_name',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getDisplayNameAttribute()
    {
        return $this->file_original_name ?: translate('Unknown');
    }

    public function getNormalizedFileNameAttribute()
    {
        return normalize_file_path($this->file_name);
    }

    public function getPreviewUrlAttribute()
    {
        if (blank($this->normalized_file_name)) {
            return null;
        }

        if (filter_var($this->normalized_file_name, FILTER_VALIDATE_URL)) {
            return $this->normalized_file_name;
        }

        if ($this->existsOnPublicDisk()) {
            return Storage::disk('public')->url($this->normalized_file_name);
        }

        return my_asset($this->normalized_file_name);
    }

    public function getDownloadUrlAttribute()
    {
        return $this->preview_url;
    }

    public function getIsPreviewableAttribute()
    {
        return $this->type === 'image' && $this->fileExists();
    }

    public function getFileIconClassAttribute()
    {
        return match ($this->type) {
            'video' => 'las la-file-video',
            'audio' => 'las la-file-audio',
            'archive' => 'las la-file-archive',
            'document' => 'las la-file-alt',
            default => 'las la-file',
        };
    }

    public function fileExists(): bool
    {
        if (blank($this->normalized_file_name)) {
            return false;
        }

        if (filter_var($this->normalized_file_name, FILTER_VALIDATE_URL)) {
            return true;
        }

        if ($this->usesS3()) {
            return Storage::disk('s3')->exists($this->normalized_file_name);
        }

        return $this->existsOnPublicDisk() || file_exists(public_path($this->normalized_file_name));
    }

    public function absolutePath(): ?string
    {
        if (blank($this->normalized_file_name) || filter_var($this->normalized_file_name, FILTER_VALIDATE_URL)) {
            return null;
        }

        if ($this->existsOnPublicDisk()) {
            return storage_path('app/public/' . $this->normalized_file_name);
        }

        $publicPath = public_path($this->normalized_file_name);
        if (file_exists($publicPath)) {
            return $publicPath;
        }

        return null;
    }

    public function deleteStoredFile(): void
    {
        if (blank($this->normalized_file_name)) {
            return;
        }

        if ($this->usesS3()) {
            Storage::disk('s3')->delete($this->normalized_file_name);
            return;
        }

        if ($this->existsOnPublicDisk()) {
            Storage::disk('public')->delete($this->normalized_file_name);
            return;
        }

        $publicPath = public_path($this->normalized_file_name);
        if (file_exists($publicPath)) {
            @unlink($publicPath);
        }
    }

    protected function existsOnPublicDisk(): bool
    {
        return !blank($this->normalized_file_name) && Storage::disk('public')->exists($this->normalized_file_name);
    }

    protected function usesS3(): bool
    {
        return config('filesystems.default') === 's3' || env('FILESYSTEM_DRIVER') === 's3';
    }
}
